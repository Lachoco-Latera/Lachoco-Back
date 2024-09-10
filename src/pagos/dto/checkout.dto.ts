import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';

export class OrderCheckoutProduct {
  @IsUUID()
  @IsOptional()
  giftCardId?: string;

  @IsString()
  @IsOptional()
  frecuency?: string;

  @ApiProperty({ example: '1234567890', description: 'Phone number' })
  @IsString()
  @Length(1, 15)
  phone: string;

  @ApiProperty({ example: '123 Main St', description: 'Street address' })
  @IsString()
  @Length(1, 100)
  street: string;

  @ApiProperty({ example: '123', description: 'House or apartment number' })
  @IsString()
  @Length(1, 10)
  number: string;

  @ApiProperty({ example: 'New York', description: 'City' })
  @IsString()
  @Length(1, 100)
  city: string;

  @ApiProperty({ example: 'NY', description: 'State or province' })
  @IsString()
  @Length(1, 100)
  state: string;

  @ApiProperty({ example: '10001', description: 'Postal code' })
  @IsString()
  @Length(1, 10)
  postalCode: string;

  @IsNotEmpty()
  @IsString()
  shipmentCountry: string;

  @IsNumber()
  shippingPrice: number;
  
  @IsNotEmpty()
  @IsString()
  shippingCarrier: string;

  @IsNotEmpty()
  @IsString()
  shippingService: string;
}

export class checkoutOrder {
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({ example: {
    "giftCardId":"123e4567-e89b-12d3-a456-426614174000",
    "coutry":"COL",
    "frecuency":"WEEKLY",
    "phone":"1234567890",
    "street":"123 Main St",
    "number":"123",
    "city":"New York",
    "state":"NY",
    "postalCode":"10001",
    "shipmentCountry":"COL",
  }})
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrderCheckoutProduct)
  order?: OrderCheckoutProduct;
}
