import { Module } from '@nestjs/common';
import { SuscriptionService } from './suscription.service';
import { SuscriptionController } from './suscription.controller';
import { EmailService } from 'src/email/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Order } from 'src/order/entities/order.entity';
import { GiftCard } from 'src/gitfcards/entities/gitfcard.entity';
import { Product } from 'src/product/entities/product.entity';
import { OrderDetailProduct } from 'src/order/entities/orderDetailsProdusct.entity';
import { SuscriptionPro } from './entity/suscription.entity';
import { OrderLabel } from 'src/order/entities/label.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Order,
      GiftCard,
      Product,
      OrderDetailProduct,
      SuscriptionPro,
      OrderLabel,
    ]),
  ],
  controllers: [SuscriptionController],
  providers: [SuscriptionService, EmailService],
})
export class SuscriptionModule {}
