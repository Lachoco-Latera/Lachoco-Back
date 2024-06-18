import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./product.entities";
import { v4 as uuid } from "uuid";
import { Order } from "./order.entities";

export enum Role {
  SUPERADMIN = "SUPERADMIN",
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
}

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuid();

  @Column({ type: "varchar", length: 40, nullable: false })
  name: string;

  @Column({ type: "varchar", length: 40, nullable: false })
  lastname: string;

  @Column({ type: "varchar", length: 40, nullable: false, unique: true })
  email: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  password: string;

  @Column({ type: "date", nullable: false })
  birthDate: string;

  @Column({ type: "enum", default: Role.CLIENT })
  role: Role;

  @OneToMany(() => Order, (order) => order.user)
  @JoinColumn({ name: "orders_id" })
  orders: Order[];

  @OneToMany(() => Product, (product) => product.user)
  favoriteProducts: Product[];
}
