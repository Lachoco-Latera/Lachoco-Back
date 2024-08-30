import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Order } from './order.entity';
import { OrderDetailProduct } from './orderDetailsProdusct.entity';
import { OrderDetailGiftCard } from './orderDetailGiftCard.entity';

@Entity({
  name: 'order_details',
})
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @OneToOne(() => Order, (order) => order.orderDetail, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @OneToMany(
    () => OrderDetailProduct,
    (orderDetailProduct) => orderDetailProduct.orderDetail,
    { cascade: true },
  )
  orderDetailProducts: OrderDetailProduct[];

  @OneToMany(
    () => OrderDetailGiftCard,
    (orderDetailGiftCard) => orderDetailGiftCard.orderDetail,
    { cascade: true },
  )
  orderDetailGiftCards: OrderDetailGiftCard[];
}
