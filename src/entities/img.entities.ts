import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { Product } from "./product.entities";

@Entity({
  name: "images",
})
export class Image {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuid();

  @Column({ type: "varchar", nullable: true })
  img: string 
    
  @ManyToOne(() => Product, (product) => product.images)
  product: Product;
}
