import { Order } from './order.entity';
import { OrderDetailProduct } from './orderDetailsProdusct.entity';
export declare class OrderDetail {
    id: string;
    price: number;
    order: Order;
    orderDetailProducts: OrderDetailProduct[];
}
