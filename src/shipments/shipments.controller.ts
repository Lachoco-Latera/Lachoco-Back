import { Controller, Post, Body } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { CancelShipmentDto } from './dto/cancel-shipments.dto';
import { TrackingShipmentDto } from './dto/tracking.dto';

@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Post('/rate')
  quoteShipments(@Body() createShipmentDto: CreateShipmentDto) {
    return this.shipmentsService.quoteShipments(createShipmentDto);
  }

  @Post('/createlabel')
  createLabel(@Body() createLabel: UpdateShipmentDto) {
    return this.shipmentsService.createlable(createLabel);
  }

  @Post('cancel')
  cancel(@Body() cancelShipment: CancelShipmentDto) {
    return this.shipmentsService.cancelShipment(cancelShipment);
  }

  @Post('/tracking')
  tracking(@Body() tracking: TrackingShipmentDto) {
    const { trackingNumber } = tracking;
    return this.shipmentsService.tracking(trackingNumber);
  }
}
