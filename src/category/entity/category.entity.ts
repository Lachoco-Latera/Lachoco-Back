import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

export enum category {
  BOMBAS = 'bombas',
  TABLETAS = 'tabletas',
  BOMBONES = 'bombones',
  CAFES = 'cafes',
  DELICIAS = 'delicias',
  CHOCOLATES_DE_ESPECIALIDAD = 'chocolates de especialidad',
  CAFE_DE_ESPECIALIDAD = 'cafe de especialidad',
  EN_EL_CAMPO = 'en el campo',
  REGALOS = 'regalos',
  SUSCRIPCION = 'suscripcion',
}
export enum CategoryIcon {
  COFFE_CUP = 'CiCoffeeCup',
  GI_CHOCOLATEBAR = 'GiChocolateBar',
  PI_GIFTLIGHT = 'PiGiftLight',
  SI_COFFEE_SCRIPT = 'SiCoffeescript',
  MD_OUTLINE_FASTFOOD = 'MdOutlineFastfood',
  PI_DIAMONDSFOUR_FILL = 'PiDiamondsFourFill',
  PI_FARMTHIN = 'PiFarmThin',
  BI_FOODMENU = 'BiFoodMenu',
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
