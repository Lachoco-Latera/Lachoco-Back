import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/orderDetail.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { OrderDetailProduct } from './entities/orderDetailsProdusct.entity';
import { Flavor } from 'src/flavor/entities/flavor.entity';
import { Address } from './entities/address.entity';
import { GiftCard } from 'src/gitfcards/entities/gitfcard.entity';
import { OrderDetailGiftCard } from './entities/orderDetailGiftCard.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderDetail,
      Product,
      User,
      OrderDetailProduct,
      Flavor,
      Address,
      GiftCard,
      OrderDetailGiftCard,
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
