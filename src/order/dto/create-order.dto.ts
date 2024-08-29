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
  IsString,
  IsOptional,
  Length,
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

export class GiftCardOrder{
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'GiftCard ID, has to be UUID',
    example: '887a8887-598b-4240-a7da-4c751a9ab2d3',
  })
  giftCardId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the recipient',
    example: 'John Doe',
  })
  nameRecipient: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email of the recipient',
    example: 'johndoe@gmail.com',
  })
  emailRecipient: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Message of the giftCard',
    example: 'Gracias por tu compra',
  })
  message?: string;
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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOrder)
  @ApiProperty({
    description: 'Array of products with ID and quantity',
    example: '[{"id":"887a8887-598b-4240-a7da-4c751a9ab2d3", "cantidad":3}]',
  })
  products?: ProductOrder[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GiftCardOrder)
  @ApiProperty({
    example: [
      {
        "giftCardId":"123e4567-e89b-12d3-a456-426614174000",
        "nameRecipient":"John Doe",
        "emailRecipient":"johndoe@gmail.com",
        "message":"Gracias por tu compra",
      }
    ],
  })
  giftCards?: GiftCardOrder[];

  @IsString()
  @IsOptional()
  additionalInfo?: string;
}
