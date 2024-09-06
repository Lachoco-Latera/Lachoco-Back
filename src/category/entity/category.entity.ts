import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

export enum category {
  BOMBAS = 'bombas',
  TABLETAS = 'tabletas',
  BOMBONES = 'bombones',
  CAFES = 'cafes',
  DELICIAS = 'delicias',
}
export enum CategoryIcon {
  SUSCRIBETE = "BiFoodMenu",
  BOMBONES = "PiDiamondsFourFill",
  TABLETAS = "GiChocolateBar",
  CHOCOLATE_DE_ESPECIALIDAD = "SiCoffeescript",
  CAFES = "CiCoffeeCup",
  DELICIAS = "MdOutlineFastfood",
  EN_EL_CAMPO = "PiFarmThin",
  REGALOS = "PiGiftLight",
}
@Entity({
  name: 'categories',
})
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'enum', enum: CategoryIcon, nullable: true })
  icon: string;

  @Column({ type: 'enum', enum: category, nullable: true })
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
