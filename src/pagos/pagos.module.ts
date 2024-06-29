import { Module } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { EmailService } from 'src/email/email.service';
import { GiftCard } from 'src/gitfcards/entities/gitfcard.entity';
import { Product } from 'src/product/entities/product.entity';
import { OrderDetailProduct } from 'src/order/entities/orderDetailsProdusct.entity';
import { OrderDetail } from 'src/order/entities/orderDetail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      GiftCard,
      Product,
      OrderDetail,
      OrderDetailProduct,
    ]),
  ],
  controllers: [PagosController],
  providers: [PagosService, EmailService],
})
export class PagosModule {}
