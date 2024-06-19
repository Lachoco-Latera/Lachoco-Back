import { User } from 'src/user/entities/user.entity';
import { OrderDetail } from './orderDetail.entity';
declare enum status {
    PENDING = "PENDING",
    FINISHED = "FINISHED"
}
export declare class Order {
    id: string;
    date: Date;
    status: status;
    orderDetail: OrderDetail;
    user: User;
}
export {};
