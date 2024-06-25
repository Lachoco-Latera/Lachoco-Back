import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';

@Injectable()
export class SuscriptionService {
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
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId.priceId,
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:5173/',
      cancel_url: 'http://localhost:3000/pricing',
    });
    return { url: session.url };
  }
}
