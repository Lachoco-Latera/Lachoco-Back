import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
@Entity({ name: 'redes' })
export class Redes {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'varchar', nullable: false })
  url: string;

  @Column({ type: 'varchar', nullable: false })
  img: string;
}
