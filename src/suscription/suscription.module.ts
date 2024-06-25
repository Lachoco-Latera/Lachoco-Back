import { Module } from '@nestjs/common';
import { SuscriptionService } from './suscription.service';
import { SuscriptionController } from './suscription.controller';

@Module({
  controllers: [SuscriptionController],
  providers: [SuscriptionService],
})
export class SuscriptionModule {}
