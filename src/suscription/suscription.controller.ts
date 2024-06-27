import { Body, Controller, Get, Post, Header, Request } from '@nestjs/common';
import { SuscriptionService } from './suscription.service';

@Controller('subscription')
export class SuscriptionController {
  constructor(private readonly suscriptionService: SuscriptionService) {}

  @Get()
  findAll() {
    return this.suscriptionService.getSuscriptions();
  }

  @Post('newsuscription')
  newSuscription(@Body() priceId: any) {
    return this.suscriptionService.newSuscription(priceId);
  }

  @Post('webhook')
  webhookSus(@Request() req: any) {
    return this.suscriptionService.webhookSus(req);
  }
}
