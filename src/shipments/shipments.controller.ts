import { Controller, Post, Body, Get } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { CancelShipmentDto } from './dto/cancel-shipments.dto';
import { GetCarriers, TrackingShipmentDto } from './dto/tracking.dto';

@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}
  @Get('carriers')
  getCarriers(@Body() country: GetCarriers) {
    return this.shipmentsService.carriesByCountry(country.countryCode);
  }

  @Post('/rate')
  quoteShipments(@Body() createShipmentDto: CreateShipmentDto) {
    return this.shipmentsService.quoteShipments(createShipmentDto);
  }

  @Post('/createlabel')
  createLabel(@Body() createLabel: UpdateShipmentDto) {
    return this.shipmentsService.createLabel(createLabel);
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
