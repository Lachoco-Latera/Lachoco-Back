import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity({
  name: 'flavors',
})
export class Flavor {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'integer', default: 0 })
  stock: number;

  @ManyToMany(() => Product, (product) => product.flavors)
  products: Product[];
}
