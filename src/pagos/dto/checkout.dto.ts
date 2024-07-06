import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class checkoutOrder {
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @IsUUID()
  @IsOptional()
  giftCardId: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsString()
  @IsNotEmpty()
  trackingNumber: string;

  @IsString()
  @IsNotEmpty()
  label: string;

  @IsNotEmpty()
  @IsString()
  totalPrice: string;
}
