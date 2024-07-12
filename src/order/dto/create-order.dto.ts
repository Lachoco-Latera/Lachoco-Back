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
  Validate,
} from 'class-validator';
import { PickedFlavorsConditional } from 'src/decorators/requireFlavor.decorator';

export class FlavorOrderDTO {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Flavor ID, has to be UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  flavorId: string;

  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Quantity of the flavor',
    example: 3,
  })
  cantidad: number;
}

export class ProductOrder {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Product ID, has to be UUID',
    example: '887a8887-598b-4240-a7da-4c751a9ab2d3',
  })
  productId: string;

  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Quantity of the product',
    example: 3,
  })
  cantidad: number;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Category of the product',
    example: 'tabletas',
  })
  category: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => FlavorOrderDTO)
  @ApiProperty({
    description: 'Array of flavors with ID and quantity',
    example:
      '[{"flavorid":"123e4567-e89b-12d3-a456-426614174000", "cantidad":3}]',
  })
  flavors: FlavorOrderDTO[];

  @IsArray()
  @Validate(PickedFlavorsConditional)
  @ApiProperty({
    description: 'Array of picked flavor IDs',
    example:
      '["123e4567-e89b-12d3-a456-426614174000", "223e4567-e89b-12d3-a456-426614174001"]',
  })
  pickedFlavors: string[];
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
