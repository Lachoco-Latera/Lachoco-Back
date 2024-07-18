import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, status } from 'src/order/entities/order.entity';
import { Stripe } from 'stripe';
import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  MercadoPagoConfig,
  MerchantOrder,
  Payment,
  Preference,
} from 'mercadopago';
import { EmailService } from 'src/email/email.service';
import { bodyPagoMP } from 'src/user/emailBody/bodyPagoMP';
import { checkoutOrder } from './dto/checkout.dto';
import { GiftCard } from 'src/gitfcards/entities/gitfcard.entity';
import { Product, statusExp } from 'src/product/entities/product.entity';
import { OrderDetail } from 'src/order/entities/orderDetail.entity';
import { OrderLabel } from 'src/order/entities/label.entity';
import { Address } from 'src/order/entities/address.entity';
import { category } from 'src/category/entity/category.entity';
import {
  frecuency,
  SuscriptionPro,
} from 'src/suscription/entity/suscription.entity';
import { OrderDetailProduct } from 'src/order/entities/orderDetailsProdusct.entity';
import { bodyOrderAdmin } from 'src/user/emailBody/bodyOrderAdmin';

const stripe = new Stripe(process.env.KEY_STRIPE);
const client = new MercadoPagoConfig({ accessToken: process.env.KEY_MP });
@Injectable()
export class PagosService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(SuscriptionPro)
    private suscriptionProRepository: Repository<SuscriptionPro>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Order)
    private orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(OrderLabel)
    private orderLabelRepository: Repository<OrderLabel>,
    @InjectRepository(GiftCard)
    private giftCardRepository: Repository<GiftCard>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    private emailService: EmailService,
  ) {}

  async checkoutSession(order: checkoutOrder) {
    let updateOrder;
    let orderById = await this.orderRepository.findOne({
      where: { id: order.orderId },
      relations: {
        orderDetail: {
          orderDetailProducts: {
            product: { category: true },
            orderDetailFlavors: true,
          },
        },
        user: { giftcards: true },
        giftCard: true,
        address: true,
      },
    });

    if (!orderById) throw new NotFoundException('Order not found');
    if (orderById.status === status.FINISHED)
      throw new BadRequestException('order is Finished');
    if (orderById.orderDetail.orderDetailProducts.length === 0)
      throw new BadRequestException('Order without products');
    let discount = 0;

    //*buscar si usuario tiene giftcard
    if (order.giftCardId !== null) {
      const findGitCard = await this.giftCardRepository.findOne({
        where: { id: order.giftCardId },
        relations: { product: true },
      });

      if (findGitCard && findGitCard.isUsed === true)
        throw new BadRequestException('GiftCard is Used');

      const hasGiftCardCode = orderById.user.giftcards?.find(
        (g) => g.code === findGitCard.code,
      );

      if (hasGiftCardCode) {
        //*si giftcardId no undefined, buscar producto
        if (findGitCard.product !== null) {
          //*agregar giftcard a orden
          await this.orderRepository.update(
            { id: orderById.id },
            { giftCard: findGitCard },
          );
          updateOrder = await this.orderRepository.findOne({
            where: { id: orderById.id },
            relations: {
              orderDetail: {
                orderDetailProducts: {
                  product: { category: true },
                  orderDetailFlavors: true,
                },
              },
              user: { giftcards: true },
              giftCard: true,
              labels: true,
              address: true,
            },
          });
          orderById = updateOrder;
        }
        discount = hasGiftCardCode.discount;
      }
    }
    if (order.country === 'COL') {
      const preference = new Preference(client);

      // totalProducts = orderById.orderDetail.orderDetailProducts.map((p) => ({
      //   id: p.id,
      //   title: p.product.category.name,
      //   quantity: p.cantidad,
      //   unit_price: Number(p.product.price),
      // }));
      // const totalPriceProducts = totalProducts.reduce(
      //   (accumulator, currentProduct) => {
      //     return accumulator + Number(currentProduct.unit_price);
      //   },
      //   0,
      // );
      // console.log(order.totalPrice);
      try {
        const res = await preference.create({
          body: {
            payer: {
              name: orderById.user.name,
              surname: orderById.user.lastname,
              email: orderById.user.email,
            },
            statement_descriptor: 'Chocolatera',
            metadata: {
              order: orderById,
              // label: order.label,
              //  trackingNumber: order.trackingNumber,
              // priceShipment: order.totalPrice,
              frecuency: order.frecuency,
            },
            back_urls: {
              success: 'https://lachoco-latera.com/pagos/success',
              failure: 'https://lachoco-latera.com/pagos/failure',
              pending: 'https://lachoco-latera.com/pagos/pending',
            },
            items: [
              {
                id: orderById.id,
                title: 'Productos',
                quantity: 1,
                unit_price: Number(orderById.orderDetail.price) - discount,
              },
            ],
            notification_url: 'https://lachocoback.vercel.app/pagos/webhook',
          },
        });
        const addAddress = new Address();
        addAddress.city = order.city;
        addAddress.country = order.shipmentCountry;
        addAddress.street = order.street;
        addAddress.state = order.state;
        addAddress.number = order.number;
        addAddress.postalCode = order.postalCode;
        addAddress.phone = order.phone;
        addAddress.order = orderById;

        await this.addressRepository.save(addAddress);
        return res.init_point;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
    if (order.country === 'SPAIN' || order.country === 'GLOBAL') {
      let customer = orderById.user.customerId;
      if (!orderById.user.customerId) {
        customer = await stripe.customers
          .create({
            email: orderById.user.email,
          })
          .then((customer) => customer.id);
      }
      // totalProducts = orderById.orderDetail.orderDetailProducts.map((p) => ({
      //   price_data: {
      //     product_data: {
      //       name: p.product.category.name,
      //       description: p.product.description,
      //     },
      //     currency: `${order.country === 'SPAIN' ? 'EUR' : 'USD'}`,
      //     unit_amount: Number(p.product.price) * p.cantidad,
      //   },
      //   quantity: p.cantidad,
      // }));

      // const totalPriceProducts = totalProducts.reduce(
      //   (accumulator, currentProduct) => {
      //     return (
      //       Number(accumulator) + Number(currentProduct.price_data.unit_amount)
      //     );
      //   },
      //   0,
      // );

      const session = await stripe.checkout.sessions.create({
        customer: customer,
        line_items: [
          {
            price_data: {
              product_data: {
                name: 'Productos',
                description: 'Productos',
              },
              currency: `${order.country === 'SPAIN' ? 'EUR' : 'USD'}`,
              unit_amount:
                Number(orderById.orderDetail.price) * 100 -
                Number(discount) * 100,
            },
            quantity: 1,
          },
        ],
        invoice_creation: { enabled: true },
        metadata: {
          order: orderById.id,
          user: orderById.user.id,
          // label: order.label,
          //trackingNumber: order.trackingNumber,
          //priceShipment: order.totalPrice,
          frecuency: order.frecuency,
        },
        mode: 'payment',
        payment_method_types: ['card'],
        success_url: 'https://lachoco-latera.com/pagos/success',
        cancel_url: 'https://lachoco-latera.com/pagos/cancel',
      });

      const addAddress = new Address();
      addAddress.city = order.city;
      addAddress.country = order.shipmentCountry;
      addAddress.street = order.street;
      addAddress.state = order.state;
      addAddress.number = order.number;
      addAddress.postalCode = order.postalCode;
      addAddress.phone = order.phone;
      addAddress.order = orderById;

      await this.addressRepository.save(addAddress);

      return { url: session.url };
    }
  }

  async success() {
    return `
      <html>
        <body>
          <h1>Pago realizado! Ya puedes cerrar esto</h1>
          <script>
            setTimeout(() => {
              window.close();
            }, 3000); // Cierra la ventana después de 3 segundos
          </script>
        </body>
      </html>
    `;
  }

  async cancel() {
    return `
      <html>
        <body>
          <h1>Pago cancelado, se volvera a la página:</h1>
          <script>
            setTimeout(() => {
              window.location.href = 'https://lachoco-front.vercel.app';
            }, 3000); // Redirige a la página después de 3 segundos
          </script>
        </body>
      </html>
    `;
  }

  //*mp webhook
  async receiveWebhook(query: any) {
    console.log(query);
    const payment = query;
    const searchPayment = new Payment(client);
    const searchMercharOrder = new MerchantOrder(client);
    try {
      if (payment.type === 'payment') {
        const data = await searchPayment.get({ id: payment['data.id'] });
        const mercharOrderBody = await searchMercharOrder.get({
          merchantOrderId: data.order.id,
        });

        const payments = mercharOrderBody.payments;

        const orderById = await this.orderRepository.findOne({
          where: { id: data.metadata.order.id },
          relations: {
            orderDetail: {
              orderDetailProducts: {
                product: { category: true },
                orderDetailFlavors: true,
              },
            },
            user: true,
            giftCard: { product: true },
          },
        });
        if (orderById.status === status.FINISHED)
          throw new BadRequestException('Order Finished');
        if (!orderById) throw new NotFoundException('Order not found');
        if (orderById.orderDetail.orderDetailProducts.length === 0)
          throw new BadRequestException('Order without products');

        if (orderById) {
          const { orderDetail } = orderById;
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
                if (data.metadata.frecuency === frecuency.WEEKLY) {
                  subscription.frecuency = frecuency.WEEKLY;
                  expiryDate.setDate(purchaseDate.getDate() + 7);
                  product.purchaseDate = purchaseDate;
                  subscription.date_finish = expiryDate;
                }
                subscription.createdAt = purchaseDate;
                subscription.date_finish = expiryDate;
                subscription.user = orderById.user;
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
                      if (data.metadata.frecuency === frecuency.MONTHLY) {
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
                          { id: orderById.id },
                          {
                            anySubscription: newSubscription.id,
                            date_7days: expiryDate7Days,
                            date_14days: expiryDate14Days,
                            date_21days: expiryDate21Days,
                            date_28days: expiryDate28Days,
                          },
                        );
                      }
                      if (data.metadata.frecuency === frecuency.WEEKLY) {
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
                          { id: orderById.id },
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
        if (orderById.giftCard !== null) {
          await this.giftCardRepository.update(
            { id: orderById.giftCard.id },
            { isUsed: true },
          );
        }

        // const orderLabel = new OrderLabel();
        // orderLabel.trackingNumber = data.metadata.tracking_number;
        // orderLabel.label = data.metadata.label;
        // orderLabel.order = orderById;
        // await this.orderLabelRepository.save(orderLabel);
        await this.orderRepository.update(
          {
            id: orderById.id,
          },
          {
            status: status.FINISHED,
          },
        );
        const template = bodyPagoMP(
          orderById.user.email, //*email
          'Compra Exitosa',
          orderById.user, //*user
          payments,
          orderById, //*order
          // data.metadata.price_shipment,
        );

        const mail = {
          to: orderById.user.email,
          subject: 'Compra Exitosa',
          text: 'Compra Exitosa',
          template: template,
        };
        await this.emailService.sendPostulation(mail);

        const template2 = bodyOrderAdmin(
          'ventas@lachoco-latera.com',
          'Orden de envio',
          orderById,
          orderById.date.toDateString(),
        );

        const mail2 = {
          to: 'ventas@lachoco-latera.com',
          subject: 'Orden de envio',
          text: 'Nueva Orden de envio',
          template: template2,
        };
        await this.emailService.sendPostulation(mail2);
      }
    } catch (error) {
      console.log(error);
    }
  }

  //*stripeWebhook
  async stripeWebhook(req: any) {
    console.log('**********', req.body, '***********');

    // const invoice = stripe.invoices.create({
    //   customer: 'cus_NeZwdNtLEOXuvB',
    // });
  }
}
