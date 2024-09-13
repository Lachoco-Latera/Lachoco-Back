import { PickType, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import {
  IsString,
  IsNumber,
  IsArray,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { label, currency } from '../entities/product.entity';

export class updateFlavorDto extends PickType(CreateProductDto, ['flavors']) {}
export class UpdateProductDto {
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  name?: string;

  @IsNumber()
  presentacion?: number;

  @IsString()
  description?: string;

  @IsNumber()
  price?: number;

  @IsEnum(currency)
  currency?: currency;

  @IsEnum(label)
  label?: label;

  @IsBoolean()
  isActive?: boolean;

  @IsArray()
  flavors?: { id: string; name: string; stock: number }[];

  @IsArray()
  images?: { id: string; img: string }[];
}
