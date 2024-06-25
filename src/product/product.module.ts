import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Image } from './entities/image.entity';
import { Flavor } from 'src/flavor/entities/flavor.entity';
import { Category } from 'src/category/entity/category.entity';
import { OrderModule } from 'src/order/order.module'; // Import OrderModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, Image, Flavor]),
    OrderModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
