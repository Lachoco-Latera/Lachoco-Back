import { ApiProperty } from '@nestjs/swagger';
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
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  price: number;

  @IsEnum(currency)
  currency: currency;

  // @IsNumber()
  // stock: number;

  @IsNumber()
  presentacion: number;

  @IsArray()
  images: string[];

  @ApiProperty({ example: [{ id: '123', name: 'Salsa', stock: 10}]})
  @IsArray()
  flavors: { id: string; name: string; stock: number }[];
}
