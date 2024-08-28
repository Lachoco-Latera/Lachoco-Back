import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderDetail } from "./orderDetail.entity";
import { GiftCard } from "src/gitfcards/entities/gitfcard.entity";


@Entity({ name: 'order_detail_gift_cards' })
export class OrderDetailGiftCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  nameRecipient: string;

  @Column({ type: 'varchar', nullable: false })
  emailRecipient: string;

  @Column({ type: 'varchar', nullable: true })
  message: string;

  @ManyToOne(
    () => OrderDetail,
    (orderDetail) => orderDetail.orderDetailGiftCards,
    { onDelete: 'CASCADE' },
  )
  orderDetail: OrderDetail;

  @ManyToOne(
    () => GiftCard,
    (giftcard) => giftcard.orderDetailGiftCards,
    { onDelete: 'CASCADE' },
  )
  giftCard: GiftCard;
}