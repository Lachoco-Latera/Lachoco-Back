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
  TB_BEACH = 'TbBeach',
  TB_MOUNTAIN = 'TbMountain',
  TB_MILKSHAKE = 'TbMilkshake',
  GI_BOAT_FISHING = 'GiBoatFishing',
  GI_FIELD = 'GiField',
  GI_FOREST_CAMP = 'GiForestCamp',
  GI_DONUT = 'GiDonut',
  GI_CUPCAKE = 'GiCupcake',
  GI_PIE_SLICE = 'GiPieSlice',
  MD_OUTLINE_VILLA = 'MdOutlineVilla',
  MD_SNOWMOBILE = 'MdSnowmobile',
  MD_OUTLINE_WB_SUNNY = 'MdOutlineWbSunny',
  MD_OUTLINE_COOKIE = 'MdOutlineCookie',
  FA_TREE_CITY = 'FaTreeCity',
  FA_ICE_CREAM = 'FaIceCream',
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
