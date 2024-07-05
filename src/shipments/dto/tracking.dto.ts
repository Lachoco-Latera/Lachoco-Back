import { IsNotEmpty, IsString, Length } from 'class-validator';

export class TrackingShipmentDto {
  @IsString()
  @IsNotEmpty()
  trackingNumber: string;
}

export class GetCarriers {
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  countryCode: string;
}
