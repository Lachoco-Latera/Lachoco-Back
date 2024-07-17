import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { OrderDetail } from './orderDetail.entity';
import { GiftCard } from 'src/gitfcards/entities/gitfcard.entity';
import { OrderLabel } from './label.entity';
import { Address } from './address.entity';

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

  @Column({ type: 'date', nullable: true })
  date_2days: Date;

  @Column({ type: 'date', nullable: true })
  date_4days: Date;

  @Column({ type: 'date', nullable: true })
  date_6days: Date;

  @Column({ type: 'date', nullable: true })
  date_8days: Date;

  @Column({ type: 'date', nullable: true })
  date_7days: Date;

  @Column({ type: 'date', nullable: true })
  date_14days: Date;

  @Column({ type: 'date', nullable: true })
  date_21days: Date;

  @Column({ type: 'date', nullable: true })
  date_28days: Date;

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

  @Column({ type: 'varchar', nullable: true })
  anySubscription: string;

  @OneToMany(() => OrderLabel, (orderLabel) => orderLabel.order, {
    cascade: true,
  })
  @JoinColumn({ name: 'orderLabels_id' })
  labels: OrderLabel[];

  @Column({ type: 'text', nullable: true })
  additionalInfo: string;

  @OneToOne(() => Address, (address) => address.order)
  @JoinColumn({ name: 'address_id' })
  address: Address;
}
