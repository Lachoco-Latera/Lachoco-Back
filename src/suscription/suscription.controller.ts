import { Body, Controller, Get, Post } from '@nestjs/common';
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
}
