import { Order } from 'src/order/entities/order.entity';
import { OrderDetailGiftCard } from 'src/order/entities/orderDetailGiftCard.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity({ name: 'giftCards' })
export class GiftCard {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'int', nullable: true })
  discount: number;

  @Column({ type: 'varchar', nullable: true })
  img: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'boolean', default: false })
  isUsed: boolean;

  @ManyToOne(() => User, (user) => user)
  user: User;

  @ManyToOne(() => Product, (product) => product.giftCards)
  product: Product;

  @Column({ type: 'int', nullable: true })
  cantidad: number;

  @OneToOne(() => Order, (order) => order.giftCard)
  order: Order;

  @OneToMany(
    () => OrderDetailGiftCard,
    (orderDetailGiftCard) => orderDetailGiftCard.giftCard,
  )
  orderDetailGiftCards: OrderDetailGiftCard[];
}
