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
import { DataSource, Repository } from 'typeorm';
import { EntityManager } from 'typeorm';
import { frecuency, SuscriptionPro } from './entity/suscription.entity';
import { OrderLabel } from 'src/order/entities/label.entity';
import { bodyOrderAdmin } from 'src/user/emailBody/bodyOrderAdmin';
import { bodypago2 } from 'src/user/emailBody/bodyPago2';
import { transporter } from 'src/utils/transportNodemailer';

@Injectable()
export class SuscriptionService {
  constructor(
    private dataSource: DataSource,
    private readonly emailService: EmailService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(SuscriptionPro)
    private suscriptionPropRepository: Repository<SuscriptionPro>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(GiftCard)
    private giftcardRepository: Repository<GiftCard>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(OrderLabel)
    private orderLabelRepository: Repository<OrderLabel>,
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
      success_url: 'https://lachocoback.vercel.app',
      cancel_url: 'https://lachocoback.vercel.app/pricing',
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
                  product: { category: true, images: true },
                  orderDetailFlavors: true,
                },
              },
              address: true,
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
                  expiryDate.setDate(purchaseDate.getDate() + 30);
                  product.purchaseDate = purchaseDate;
                  product.expiryDate = expiryDate;
                  product.status = statusExp.ACTIVATED;

                  const subscription = new SuscriptionPro();
                  if (
                    checkoutSessionCompleted.metadata.frecuency ===
                    frecuency.WEEKLY
                  ) {
                    subscription.frecuency = frecuency.WEEKLY;
                    expiryDate.setDate(purchaseDate.getDate() + 7);
                    product.purchaseDate = purchaseDate;
                    subscription.date_finish = expiryDate;
                  }
                  subscription.createdAt = purchaseDate;
                  subscription.date_finish = expiryDate;
                  subscription.user = order.user;
                  //*Guardar suscripcion
                  try {
                    await this.dataSource.transaction(
                      async (manager: EntityManager) => {
                        // Guardar la suscripción
                        const newSubscription = await manager.save(
                          SuscriptionPro,
                          subscription,
                        );
                        console.log('Subscription guardada:', newSubscription);
                        if (
                          checkoutSessionCompleted.metadata.frecuency ===
                          frecuency.MONTHLY
                        ) {
                          const purchaseDate = new Date();
                          const expiryDate7Days = new Date(purchaseDate);
                          expiryDate7Days.setDate(purchaseDate.getDate() + 7);
                          const expiryDate14Days = new Date(purchaseDate);
                          expiryDate14Days.setDate(purchaseDate.getDate() + 14);
                          const expiryDate21Days = new Date(purchaseDate);
                          expiryDate21Days.setDate(purchaseDate.getDate() + 21);
                          const expiryDate28Days = new Date(purchaseDate);
                          expiryDate28Days.setDate(purchaseDate.getDate() + 28);
                          await manager.update(
                            Order,
                            { id: order.id },
                            {
                              anySubscription: newSubscription.id,
                              date_7days: expiryDate7Days,
                              date_14days: expiryDate14Days,
                              date_21days: expiryDate21Days,
                              date_28days: expiryDate28Days,
                            },
                          );
                        }
                        if (
                          checkoutSessionCompleted.metadata.frecuency ===
                          frecuency.WEEKLY
                        ) {
                          const purchaseDate = new Date();
                          const expiryDate2Days = new Date(purchaseDate);
                          expiryDate2Days.setDate(purchaseDate.getDate() + 2);
                          const expiryDate4Days = new Date(purchaseDate);
                          expiryDate4Days.setDate(purchaseDate.getDate() + 4);
                          const expiryDate6Days = new Date(purchaseDate);
                          expiryDate6Days.setDate(purchaseDate.getDate() + 6);
                          const expiryDate8Days = new Date(purchaseDate);
                          expiryDate8Days.setDate(purchaseDate.getDate() + 8);
                          await manager.update(
                            Order,
                            { id: order.id },
                            {
                              anySubscription: newSubscription.id,
                              date_2days: expiryDate2Days,
                              date_4days: expiryDate4Days,
                              date_6days: expiryDate6Days,
                              date_8days: expiryDate8Days,
                            },
                          );
                        }
                        // Actualizar estado suscripción en order

                        // Guardar el detalle del producto del pedido
                        await manager.save(
                          OrderDetailProduct,
                          orderDetailProduct,
                        );

                        console.log(
                          'Operaciones después de guardar la suscripción completadas',
                        );
                      },
                    );
                  } catch (error) {
                    console.error('Error al guardar la suscripción:', error);
                    // Manejar el error según sea necesario
                  }
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

          // const orderLabel = new OrderLabel();
          // orderLabel.trackingNumber =
          //   checkoutSessionCompleted.metadata.trackingNumber;
          // orderLabel.label = checkoutSessionCompleted.metadata.label;
          // orderLabel.order = order;
          // await this.orderLabelRepository.save(orderLabel);

          await this.orderRepository.update(
            {
              id: checkoutSessionCompleted.metadata.order,
            },
            {
              status: status.FINISHED,
            },
          );

          const template = bodypago2(
            userEmail.email,
            'Compra Exitosa',
            userEmail,
            invoice.hosted_invoice_url,
            order,
            //checkoutSessionCompleted.metadata.priceShipment,
          );
          const info = await transporter.sendMail({
            from: '"Lachoco-latera" <ventas_lachoco_latera@hotmail.com>', // sender address
            to: userEmail.email, // list of receivers
            subject: 'Compra Exitosa', // Subject line
            text: 'Compra Exitosa', // plain text body
            html: template, // html body
          });
          console.log('Message sent: %s', info.messageId);
          // const mail = {
          //   to: userEmail.email,
          //   subject: 'Compra Exitosa',
          //   text: 'Compra Exitosa',
          //   template: template,
          // };
          // await this.emailService.sendPostulation(mail);

          //*correo al admin
          const template2 = bodyOrderAdmin(
            'ventas_lachoco_latera@hotmail.com',
            'Orden de envio',
            order,
            order.date,
          );
          // const mail2 = {
          //   to: 'ventas@lachoco-latera.com',
          //   subject: 'Orden de envio',
          //   text: 'Nueva Orden de envio',
          //   template: template2,
          // };
          // await this.emailService.sendPostulation(mail2);
          const info2 = await transporter.sendMail({
            from: '"Lachoco-latera" <ventas_lachoco_latera@hotmail.com>', // sender address
            to: 'ventas_lachoco_latera@hotmail.com', // list of receivers
            subject: 'Orden de envio', // Subject line
            text: 'Nueva Orden de envio', // plain text body
            html: template2, // html body
          });
          console.log('Message sent: %s', info2.messageId);
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
