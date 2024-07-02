import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { OrderDetail } from './orderDetail.entity';
import { GiftCard } from 'src/gitfcards/entities/gitfcard.entity';

export enum status {
  PENDING = 'PENDING',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

@Entity({
  name: 'orders',
})
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'enum', enum: status, default: status.PENDING })
  status: status;

  @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.order, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  orderDetail: OrderDetail;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => GiftCard)
  @JoinColumn()
  giftCard: GiftCard;

  @Column({ type: 'uuid', nullable: true })
  cancelByUserId: string = uuid();
}
