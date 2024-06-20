import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Flavor } from './entities/sabor.entity';
import { Image } from './entities/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Image, Flavor])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
