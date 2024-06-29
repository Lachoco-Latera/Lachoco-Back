import { Module } from '@nestjs/common';
import { GitfcardsService } from './gitfcards.service';
import { GitfcardsController } from './gitfcards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { GiftCard } from './entities/gitfcard.entity';
import { Product } from 'src/product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, GiftCard, Product])],
  controllers: [GitfcardsController],
  providers: [GitfcardsService],
})
export class GitfcardsModule {}
