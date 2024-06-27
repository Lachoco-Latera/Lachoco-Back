import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { PagosService } from './pagos.service';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post('create-checkout-session')
  checkoutSession(@Body() order: any) {
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
  receivceWebhook(@Query() query: any) {
    return this.pagosService.receiveWebhook(query);
  }

  @Post('stripewebhook')
  stripewbhook(@Request() req: any) {
    return this.pagosService.stripeWebhook(req);
  }
}
