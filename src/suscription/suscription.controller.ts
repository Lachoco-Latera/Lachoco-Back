import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { SuscriptionService } from './suscription.service';

@Controller('subscription')
export class SuscriptionController {
  constructor(private readonly suscriptionService: SuscriptionService) {}

  @Get()
  findAll() {
    return this.suscriptionService.newPlanMP();
  }

  @Post('/prueba')
  prueba(@Request() evnt: any) {
    console.log(evnt);
    return this.suscriptionService.prueba();
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
