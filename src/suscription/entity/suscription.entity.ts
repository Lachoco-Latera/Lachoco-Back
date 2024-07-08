import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity({
  name: 'suscriptions',
})
export class Suscription {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'timestamp', nullable: true })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  date_finish: Date;

  @OneToOne(() => User, (user) => user.suscription)
  user: User;
}
