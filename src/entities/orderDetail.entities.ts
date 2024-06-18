import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Order } from "./order.entities";
import { Product } from "./product.entities";
import { v4 as uuid } from "uuid";

@Entity({
  name: "order_details",
})
export class OrderDetail {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuid();

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  price: number;

  @OneToOne(() => Order, (order) => order.orderDetail)
  @JoinColumn({ name: "order_id" })
  order: Order;

  @ManyToMany(() => Product, { lazy: false })
  @JoinTable({ name: "order_details_products" })
  products: Product[];
}
