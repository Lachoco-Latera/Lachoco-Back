import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

export enum Role {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'varchar', length: 40, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 40, nullable: false })
  lastname: string;

  @Column({ type: 'varchar', length: 40, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 40, nullable: false })
  country: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.CLIENT })
  role: Role;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true })
  suscriptionId: string;

  @Column({ type: 'varchar', nullable: true })
  customerId: string;

  @OneToMany(() => Order, (order) => order.user)
  @JoinColumn({ name: 'orders_id' })
  orders: Order[];

  @ManyToMany(() => Product)
  @JoinTable()
  favoriteProducts: Product[];
}
