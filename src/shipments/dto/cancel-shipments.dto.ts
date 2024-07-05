import { IsString } from 'class-validator';

export class CancelShipmentDto {
  @IsString()
  carrier: string;
  @IsString()
  trackingNumber: string;
}
