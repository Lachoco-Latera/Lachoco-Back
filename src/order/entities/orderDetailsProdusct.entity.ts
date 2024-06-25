import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { OrderDetail } from './orderDetail.entity';
import { OrderDetailFlavor } from './flavorDetail.entity';

@Entity('order_details_products')
export class OrderDetailProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  cantidad: number;

  @ManyToOne(
    () => OrderDetail,
    (orderDetail) => orderDetail.orderDetailProducts,
    { onDelete: 'CASCADE' },
  )
  orderDetail: OrderDetail;

  @ManyToOne(() => Product, (product) => product.orderDetailProducts, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @OneToMany(
    () => OrderDetailFlavor,
    (orderDetailFlavor) => orderDetailFlavor.orderDetailProduct,
    { cascade: true },
  )
  orderDetailFlavors: OrderDetailFlavor[];

  @Column({ type: 'text', array: true, default: '{}', nullable: true })
  pickedFlavors?: string[];
}
