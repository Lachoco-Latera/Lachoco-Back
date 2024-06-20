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
import { Image } from './image.entity';
import { Flavor } from './sabor.entity';

export enum category {
  BOMBAS = 'bombas',
  TABLETAS = 'tabletas',
  BOMBONES = 'bombones',
}

export enum label {
  ONLINE = 'SoloOnline',
  NEW = 'nuevo',
}

@Entity({
  name: 'products',
})
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'enum', enum: category, nullable: false })
  category: category;

  @Column({ type: 'integer', nullable: false })
  presentacion: number;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'integer', nullable: false })
  stock: number;

  @Column({ type: 'enum', enum: label, default: label.NEW })
  label: label;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => Image, (image) => image.product)
  @JoinColumn({ name: 'img_id' })
  images: Image[];

  @ManyToMany(() => Flavor)
  @JoinTable()
  flavors: Flavor[];
}
