import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Image } from './entities/image.entity';
import { Flavor } from 'src/flavor/entities/flavor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Image, Flavor])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
