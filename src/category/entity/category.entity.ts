import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

export enum category {
  BOMBAS = 'bombas',
  TABLETAS = 'tabletas',
  BOMBONES = 'bombones',
}

@Entity({
  name: 'categories',
})
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'enum', enum: category, nullable: true })
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
