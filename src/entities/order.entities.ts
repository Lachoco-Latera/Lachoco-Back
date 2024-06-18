import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { User } from "./user.entities";
import { OrderDetail } from "./orderDetail.entities";

enum status {
  PENDING = "PENDING",
  FINISHED = "FINISHED",
}

@Entity({
  name: "orders",
})
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuid();

  @Column({ type: "date", nullable: false })
  date: Date;

  @Column({ type: "enum", default: status.PENDING })
  status: status;

  @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetail: OrderDetail;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: "user_id" })
  user: User;
}
