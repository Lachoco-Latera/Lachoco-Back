import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class checkoutOrder {
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @IsUUID()
  @IsOptional()
  giftCardId?: string;

  @IsNotEmpty()
  @IsString()
  country: string;

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
}
