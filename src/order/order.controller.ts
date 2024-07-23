import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

import { ApiTags } from '@nestjs/swagger';
import { PaginationQuery } from 'src/dto/pagination.dto';
import { GuardRoles } from 'src/guards/role.guard';
import { GuardToken } from 'src/guards/token.guard';
import { Role } from 'src/user/entities/user.entity';
import { Roles } from 'src/decorators/userRole.decorator';

@Controller('orders')
@ApiTags('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll(pagination?: PaginationQuery) {
    return this.orderService.findAll(pagination);
  }

  @Get('/finished')
  orderFinished() {
    return this.orderService.ordersFinished();
  }

  @Get('/finished/:id')
  orderFinishedByUser(@Param('id', ParseUUIDPipe) userId: string) {
    return this.orderService.ordersFinishedByUser(userId);
  }

  @Put('/confirm/:id')
  confirmOrder(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.confirmOrder(id);
  }

  @Put('/cancel/:id')
  cancelOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() cancelByUserId: string,
  ) {
    return this.orderService.cancelOrder(id, cancelByUserId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    const message = await this.orderService.remove(id);
    return { message };
  }
}
