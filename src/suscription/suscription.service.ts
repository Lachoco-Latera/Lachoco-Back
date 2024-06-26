import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EmailService } from 'src/email/email.service';
import { bodySuscription } from 'src/user/emailBody/bodysuscripcion';
import { User } from 'src/user/entities/user.entity';
import { Stripe } from 'stripe';
import { Repository } from 'typeorm';

@Injectable()
export class SuscriptionService {
  constructor(
    private readonly emailService: EmailService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async getSuscriptions() {
    const stripe = new Stripe(process.env.KEY_STRIPE);
    const prices = await stripe.prices.list();

    //*Factura suscripcion
    // const customer = await stripe.customers.list();
    // const uno = customer.data.find((c) => c.id === 'cus_QLzvXcJziTrlh2');
    // const factura = await stripe.invoices.list();
    // const factura1 = factura.data.find((f) => f.customer === uno.id);
    // console.log(factura1);
    return prices.data;
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
    const endpointSecret = 'whsec_AfVcnMUB2METz7opiZxkLfccPo0Hbxpy';

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

        console.log(checkoutSessionCompleted.customer_details.email);

        const userEmail = await this.userRepository.findOne({
          where: {
            email: checkoutSessionCompleted.customer_details.email,
          },
        });
        if (!userEmail)
          throw new NotFoundException(`UserEMail ${userEmail.email} notFound`);

        const invoice = await stripe.invoices.retrieve(
          checkoutSessionCompleted.invoice,
        );

        const template = bodySuscription(
          userEmail.email,
          'Suscripcion Exitosa',
          userEmail,
          invoice.hosted_invoice_url,
        );

        const mail = {
          to: userEmail.email,
          subject: 'Suscripcion Exitosa',
          text: 'Suscripcion Exitosa',
          template: template,
        };
        await this.emailService.sendPostulation(mail);

        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }
}
