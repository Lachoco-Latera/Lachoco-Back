import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Image } from './image.entity';

export enum category {
  BOMBAS = 'bombas',
  TABLETAS = 'tabletas',
  BOMBONES = 'bombbones',
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

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'integer', nullable: false })
  stock: number;

  @Column({ type: 'enum', enum: category, nullable: false })
  category: category;

  @Column({ type: 'enum', enum: label, default: label.NEW })
  label: label;

  @OneToMany(() => Image, (image) => image.product)
  @JoinColumn({ name: 'img_id' })
  images: Image[];

  @ManyToMany(() => User, (user) => user.favoriteProducts)
  user: User;
}
