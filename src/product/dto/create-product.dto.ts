import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { category, label } from 'src/product/entities/product.entity';

export class CreateProductDto {
  @IsEnum(category)
  category: category;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;

  @IsEnum(label)
  label: label;

  @IsNumber()
  presentacion: number;

  @IsArray()
  images: string[];

  @IsArray()
  flavors: string[];
}
