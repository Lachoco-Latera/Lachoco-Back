import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { checkoutOrder } from './dto/checkout.dto';
import { transporter } from 'src/utils/transportNodemailer';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post()
  async prueba() {
    transporter.verify(function (error, success) {
      if (error) {
        console.log('Error: ', error);
      } else {
        console.log('Server is ready to take our messages');
      }
    });
    const info = await transporter.sendMail({
      from: '"Lachoco-latera" <ventas_lachoco_latera@hotmail.com>', // sender address
      to: 'carlos.jmr90@gmail.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: '<b>Hello world?</b>', // html body
    });
    console.log('Message sent: %s', info.messageId);
  }

  @Post('create-checkout-session')
  checkoutSession(@Body() order: checkoutOrder) {
    console.log('Body checkout',order);
    return this.pagosService.checkoutSession(order);
  }

  @Get('success')
  success() {
    return this.pagosService.success();
  }
  @Get('cancel')
  cancel() {
    return this.pagosService.cancel();
  }

  @Post('webhook')
  receiveWebhook(@Query() query: any) {
    return this.pagosService.receiveWebhook(query);
  }

  @Post('stripewebhook')
  stripewbhook(@Request() req: any) {
    return this.pagosService.stripeWebhook(req);
  }
}
