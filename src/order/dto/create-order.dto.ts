import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsUUID,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';

class ProductOrder {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Product ID, has to be UUID',
    example: '887a8887-598b-4240-a7da-4c751a9ab2d3',
  })
  id: string;

  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Quantity of the product',
    example: 3,
  })
  cantidad: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'User ID, has to be UUID',
    example: '887a8887-598b-4240-a7da-4c751a9ab2d3',
  })
  userId: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductOrder)
  @ApiProperty({
    description: 'Array of products with ID and quantity',
    example: '[{"id":"887a8887-598b-4240-a7da-4c751a9ab2d3", "cantidad":3}]',
  })
  products: ProductOrder[];
}
