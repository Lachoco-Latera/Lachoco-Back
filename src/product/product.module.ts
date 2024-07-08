import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Image } from './entities/image.entity';
import { Flavor } from 'src/flavor/entities/flavor.entity';
import { Category } from 'src/category/entity/category.entity';
import { OrderModule } from 'src/order/order.module'; // Import OrderModule
import { OrderDetailProduct } from 'src/order/entities/orderDetailsProdusct.entity';
import { Suscription } from 'src/suscription/entity/suscription.entity';
import { Order } from 'src/order/entities/order.entity';
import { User } from 'mercadopago';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category,
      Image,
      Flavor,
      OrderDetailProduct,
      Suscription,
      Order,
      User,
    ]),
    OrderModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
