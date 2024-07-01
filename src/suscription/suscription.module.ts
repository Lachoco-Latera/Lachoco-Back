import { Module } from '@nestjs/common';
import { SuscriptionService } from './suscription.service';
import { SuscriptionController } from './suscription.controller';
import { EmailService } from 'src/email/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Order } from 'src/order/entities/order.entity';
import { GiftCard } from 'src/gitfcards/entities/gitfcard.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Order, GiftCard])],
  controllers: [SuscriptionController],
  providers: [SuscriptionService, EmailService],
})
export class SuscriptionModule {}
