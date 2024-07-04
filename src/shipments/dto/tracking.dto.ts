import { IsNotEmpty, IsString } from 'class-validator';

export class TrackingShipmentDto {
  @IsString()
  @IsNotEmpty()
  trackingNumber: string;
}
