import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity({ name: 'giftCards' })
export class GiftCard {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'int', nullable: true })
  amount: number;

  @Column({ type: 'varchar', nullable: true })
  img: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @ManyToOne(() => User, (user) => user)
  user: User;
}
