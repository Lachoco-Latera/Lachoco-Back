import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Image } from './image.entity';

import { OrderDetailProduct } from 'src/order/entities/orderDetailsProdusct.entity';
import { Flavor } from 'src/flavor/entities/flavor.entity';
import { Category } from 'src/category/entity/category.entity';
import { GiftCard } from 'src/gitfcards/entities/gitfcard.entity';

export enum label {
  ONLINE = 'SoloOnline',
  NEW = 'nuevo',
}

export enum currency {
  COP = 'COP',
  USD = 'USD',
  EUR = 'EUR',
}

export enum statusExp {
  DISABLED = 'Disabled',
  ACTIVATED = 'activated',
  EXPIRED = 'expired',
}

@Entity({
  name: 'products',
})
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @Column({ type: 'text', nullable: true })
  name: string;

  @Column({ type: 'integer', nullable: false })
  presentacion: number;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'enum', enum: currency, nullable: false })
  currency: currency;

  @Column({ type: 'enum', enum: label, default: label.NEW })
  label: label;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => Image, (image) => image.product, { cascade: true })
  @JoinColumn({ name: 'img_id' })
  images: Image[];

  @ManyToMany(() => Flavor, (flavor) => flavor.products)
  @JoinTable()
  flavors: Flavor[];

  @OneToMany(
    () => OrderDetailProduct,
    (orderDetailProduct) => orderDetailProduct.product,
  )
  orderDetailProducts: OrderDetailProduct[];

  @OneToMany(() => GiftCard, (giftCard) => giftCard.product)
  giftCards: GiftCard[];

  @Column({ type: 'date', nullable: true })
  purchaseDate: Date;

  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

  @Column({ type: 'enum', enum: statusExp, default: statusExp.DISABLED })
  status: statusExp;
}
