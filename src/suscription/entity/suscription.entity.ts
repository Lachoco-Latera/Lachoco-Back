import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

export enum statusSubs {
  ACTIVATED = 'activated',
  EXPIRED = 'expired',
}

export enum frecuency {
  MONTHLY = 'MONTHLY',
  WEEKLY = 'WEEKLY',
}

@Entity({
  name: 'suscriptions',
})
export class SuscriptionPro {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'timestamp', nullable: true })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  date_finish: Date;

  @OneToOne(() => User, (user) => user.suscriptionPro)
  user: User;

  @Column({ type: 'enum', enum: statusSubs, default: statusSubs.ACTIVATED })
  status: statusSubs;

  @Column({ type: 'enum', enum: frecuency, default: frecuency.MONTHLY })
  frecuency: frecuency;
}
