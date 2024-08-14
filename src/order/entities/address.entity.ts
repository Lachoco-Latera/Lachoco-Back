import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'addresses' })
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 15 })
  phone: string;

  @Column({ type: 'varchar', length: 100 })
  street: string;

  @Column({ type: 'varchar', length: 10 })
  number: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 100 })
  state: string;

  @Column({ type: 'varchar', length: 100 })
  country: string;

  @Column({ type: 'varchar', length: 10 })
  postalCode: string;

  @OneToOne(() => Order, (order) => order.address)
  order: Order;
}
