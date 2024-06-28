import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGitfcardDto } from './dto/create-gitfcard.dto';
import { UpdateGitfcardDto } from './dto/update-gitfcard.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { GiftCard } from './entities/gitfcard.entity';
import { User } from 'src/user/entities/user.entity';
import { generateUniqueCode } from 'src/utils/gerenateCode';

@Injectable()
export class GitfcardsService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(GiftCard)
    private giftcardRepository: Repository<GiftCard>,
  ) {}

  async create(createGitfcardDto: CreateGitfcardDto) {
    const findUser = await this.userRepository.findOne({
      where: { id: createGitfcardDto.userId },
    });
    if (!findUser) throw new NotFoundException('User not found');

    const giftCard = {
      amount: createGitfcardDto.amount,
      img: createGitfcardDto.img,
      user: findUser,
      code: generateUniqueCode(),
    };
    console.log(giftCard);

    const newGiftCard = await this.giftcardRepository.save(giftCard);

    const { user, code, ...gift } = newGiftCard;
    const { password, ...noPassUser } = user;
    return { gift, noPassUser, msg: 'Gift card created successfully' };
  }

  async findAll() {
    const allGiftCards = await this.giftcardRepository.find();
    const giftCardNoCode = allGiftCards.map((g) => {
      const { code, ...returnG } = g;
      return returnG;
    });
    return giftCardNoCode;
  }

  async findOne(id: string) {
    const giftCard = await this.giftcardRepository.findOne({
      where: { id: id },
    });
    if (!giftCard) throw new NotFoundException('Giftcard not found');
    const { code, ...returnCard } = giftCard;

    return returnCard;
  }

  async remove(id: string) {
    const giftCard = await this.giftcardRepository.findOne({
      where: { id: id },
    });
    if (!giftCard) throw new NotFoundException('Giftcard not found');
    await this.giftcardRepository.delete(id);
    return `GiftCard ${id} deleted`;
  }
}
