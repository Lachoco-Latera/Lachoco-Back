import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Console } from 'console';
import MercadoPagoConfig, {
  CardToken,
  Invoice,
  Payment,
  PreApproval,
  PreApprovalPlan,
} from 'mercadopago';
import { category } from 'src/category/entity/category.entity';

import { EmailService } from 'src/email/email.service';
import { GiftCard } from 'src/gitfcards/entities/gitfcard.entity';
import { Order, status } from 'src/order/entities/order.entity';
import { OrderDetailProduct } from 'src/order/entities/orderDetailsProdusct.entity';
import { Product, statusExp } from 'src/product/entities/product.entity';
import { bodypago } from 'src/user/emailBody/bodyPago';
import { bodySuscription } from 'src/user/emailBody/bodysuscripcion';
import { User } from 'src/user/entities/user.entity';
import { Stripe } from 'stripe';
import { Repository } from 'typeorm';

@Injectable()
export class SuscriptionService {
  constructor(
    private readonly emailService: EmailService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(GiftCard)
    private giftcardRepository: Repository<GiftCard>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(OrderDetailProduct)
    private orderDetailProductRepository: Repository<OrderDetailProduct>,
  ) {}
  async getSuscriptions() {
    const stripe = new Stripe(process.env.KEY_STRIPE);
    const prices = await stripe.prices.list();
    const client = new MercadoPagoConfig({ accessToken: process.env.KEY_MP });
    const sinvoice = await new PreApproval(client);
    const invoice = sinvoice.get({ id: '60df5cc579e44bbd8772c7cf8972ce86' });
    const suscripcion = await stripe.subscriptions.list();
    //*Factura suscripcion
    // const customer = await stripe.customers.list();
    // const uno = customer.data.find((c) => c.id === 'cus_QLzvXcJziTrlh2');
    // const factura = await stripe.invoices.list();
    // const factura1 = factura.data.find((f) => f.customer === uno.id);
    // console.log(factura1);
    return prices;
  }

  async newPlanMP() {
    const client = new MercadoPagoConfig({ accessToken: process.env.KEY_MP });
    const createPlan = new PreApprovalPlan(client);

    const newPlan = await createPlan.create({
      body: {
        reason: 'chocolateraPLanMensual',
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          repetitions: 12, // Permitir que la suscripción se renueve cada mes durante un año (12 meses)
          billing_day: 10,
          billing_day_proportional: true,
          free_trial: {
            frequency: 1,
            frequency_type: 'days',
          },
          transaction_amount: 200,
          currency_id: 'ARS',
        },
        payment_methods_allowed: {
          payment_types: [{ id: 'credit_card' }, { id: 'debit_card' }],
          payment_methods: [],
        },
        back_url: 'https://lachoco-back.onrender.com',
      },
    });

    return newPlan;
  }

  async newSuscription(priceId: any) {
    const stripe = new Stripe(process.env.KEY_STRIPE);

    const findPlan = await stripe.plans.retrieve(priceId.priceId);

    if (!findPlan) {
      throw new NotFoundException('Plan no encontrado');
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId.priceId,
          quantity: 1,
        },
      ],
      metadata: { planId: findPlan.id },
      success_url: 'http://localhost:5173/',
      cancel_url: 'http://localhost:3000/pricing',
    });
    return { url: session.url };
  }

  async webhookSus(req: any) {
    const stripe = new Stripe(process.env.KEY_STRIPE);
    const endpointSecret = process.env.ENDPOINT_SECRET;

    const body = JSON.stringify(req.body, null, 2);

    //const sig = req.headers['stripe-signature'];

    const header = stripe.webhooks.generateTestHeaderString({
      payload: body,
      secret: endpointSecret,
    });

    let event;

    try {
      event = stripe.webhooks.constructEvent(body, header, endpointSecret);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
    // Manejar el evento de Stripe
    switch (event.type) {
      case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object;

        const userEmail = await this.userRepository.findOne({
          where: {
            email: checkoutSessionCompleted.customer_details.email,
          },
        });
        if (!userEmail)
          throw new NotFoundException(`UserEMail ${userEmail.email} notFound`);

        console.log(checkoutSessionCompleted);
        if (checkoutSessionCompleted.mode === 'suscripcion') {
          await this.userRepository.update(
            { email: userEmail.email },
            { suscriptionId: checkoutSessionCompleted.subscription },
          );

          const invoice = await stripe.invoices.retrieve(
            checkoutSessionCompleted.invoice,
          );

          const suscripcion = await stripe.subscriptions.retrieve(
            checkoutSessionCompleted.subscription,
          );

          const template = bodySuscription(
            userEmail.email,
            'Suscripcion Exitosa',
            userEmail,
            invoice.hosted_invoice_url,
            suscripcion,
          );

          const mail = {
            to: userEmail.email,
            subject: 'Suscripcion Exitosa',
            text: 'Suscripcion Exitosa',
            template: template,
          };
          await this.emailService.sendPostulation(mail);
        }
        if (checkoutSessionCompleted.mode === 'payment') {
          //*actualizar order a finalizada
          const invoice = await stripe.invoices.retrieve(
            checkoutSessionCompleted.invoice,
          );
          const order = await this.orderRepository.findOne({
            where: { id: checkoutSessionCompleted.metadata.order },
            relations: {
              orderDetail: {
                orderDetailProducts: {
                  product: { category: true },
                  orderDetailFlavors: true,
                },
              },
              user: true,
              giftCard: { product: { category: true } },
            },
          });

          if (order) {
            const { orderDetail } = order;
            if (orderDetail && orderDetail.orderDetailProducts) {
              for (const orderDetailProduct of orderDetail.orderDetailProducts) {
                const { product } = orderDetailProduct;
                if (product && product.category.name === category.CAFES) {
                  const purchaseDate = new Date();
                  const expiryDate = new Date(purchaseDate);
                  expiryDate.setDate(purchaseDate.getDate() + 7);

                  product.purchaseDate = purchaseDate;
                  product.expiryDate = expiryDate;
                  product.status = statusExp.ACTIVATED;

                  await this.orderDetailProductRepository.save(
                    orderDetailProduct,
                  );
                }
              }
            }
          }

          //*Encaso de que tenga cupo actualizar a usado
          if (order.giftCard !== null) {
            await this.giftcardRepository.update(
              { id: order.giftCard.id },
              { isUsed: true },
            );
          }

          await this.orderRepository.update(
            {
              id: checkoutSessionCompleted.metadata.order,
            },
            { status: status.FINISHED },
          );

          const template = bodypago(
            userEmail.email,
            'Compra Exitosa',
            userEmail,
            invoice.hosted_invoice_url,
            order,
          );

          const mail = {
            to: userEmail.email,
            subject: 'Compra Exitosa',
            text: 'Compra Exitosa',
            template: template,
          };
          await this.emailService.sendPostulation(mail);
        }
    }
  }
  //*webhook subscription/prueba
  async prueba(event) {
    const client = new MercadoPagoConfig({ accessToken: process.env.KEY_MP });
    const searchPayment = new Payment(client);

    const card = new CardToken(client);
    card.create({ body: {} });
    const payment = await searchPayment.get({ id: event.body.data.id });

    const findUser = await this.userRepository.findOne({
      where: { email: payment.payer.email },
    });
  }
}
