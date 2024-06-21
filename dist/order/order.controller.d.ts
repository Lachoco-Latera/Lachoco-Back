import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaginationQuery } from 'src/dto/pagination.dto';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(createOrderDto: CreateOrderDto): Promise<import("./entities/order.entity").Order[]>;
    findAll(pagination?: PaginationQuery): Promise<import("./entities/order.entity").Order[]>;
    confirmOrder(id: string): Promise<void>;
    findOne(id: string): Promise<import("./entities/order.entity").Order>;
    update(id: string, updateOrderDto: UpdateOrderDto): string;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
