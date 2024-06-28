import { Module } from '@nestjs/common';
import { GitfcardsService } from './gitfcards.service';
import { GitfcardsController } from './gitfcards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { GiftCard } from './entities/gitfcard.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, GiftCard])],
  controllers: [GitfcardsController],
  providers: [GitfcardsService],
})
export class GitfcardsModule {}
