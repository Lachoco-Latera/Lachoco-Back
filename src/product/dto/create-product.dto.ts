import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { label, currency } from 'src/product/entities/product.entity';

export class CreateProductDto {
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  price: number;

  @IsEnum(currency)
  currency: currency;

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
