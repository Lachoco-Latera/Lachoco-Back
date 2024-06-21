import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Flavor } from 'src/flavor/entities/flavor.entity';
import { OrderDetailProduct } from './orderDetailsProdusct.entity';

@Entity('order_details_flavors')
export class OrderDetailFlavor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Flavor, { cascade: true })
  @JoinColumn({ name: 'flavor_id' })
  flavor: Flavor;

  @ManyToOne(
    () => OrderDetailProduct,
    (orderDetailProduct) => orderDetailProduct.orderDetailFlavors,
    { onDelete: 'CASCADE' },
  )
  orderDetailProduct: OrderDetailProduct;

  @Column({ type: 'int', nullable: false })
  cantidad: number;
}
