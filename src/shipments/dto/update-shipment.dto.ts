import { PartialType } from '@nestjs/swagger';
import { CreateShipmentDto } from './create-shipment.dto';
import { IsString } from 'class-validator';

export class UpdateShipmentDto extends PartialType(CreateShipmentDto) {
  @IsString()
  carrierService: string;
}
