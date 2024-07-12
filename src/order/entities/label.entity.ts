import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity({
  name: 'order_labels',
})
export class OrderLabel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  trackingNumber: string;

  @Column({ type: 'varchar', nullable: true })
  label: string;

  @ManyToOne(() => Order, (order) => order.labels, {
    onDelete: 'CASCADE',
  })
  order: Order;
}
