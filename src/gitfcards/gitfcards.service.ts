import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGitfcardDto } from './dto/create-gitfcard.dto';
import { UpdateGitfcardDto } from './dto/update-gitfcard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GiftCard } from './entities/gitfcard.entity';
import { User } from 'src/user/entities/user.entity';
import { generateUniqueCode } from 'src/utils/gerenateCode';
import { CreateGitfcardCoffeeDto } from './dto/create-gitfcardCoffe.dto';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class GitfcardsService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(GiftCard)
    private giftcardRepository: Repository<GiftCard>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createGitfcardDto: CreateGitfcardDto) {
    const findUser = await this.userRepository.findOne({
      where: { id: createGitfcardDto.userId },
    });
    if (!findUser) throw new NotFoundException('User not found');

    const giftCard = {
      discount: createGitfcardDto.discount,
      img: createGitfcardDto.img,
      user: findUser,
      code: generateUniqueCode(),
    };

    const newGiftCard = await this.giftcardRepository.save(giftCard);

    const { user, code, ...gift } = newGiftCard;
    const { password, ...noPassUser } = user;
    return { gift, noPassUser, msg: 'Gift card created successfully' };
  }

  async giftCoffe(createGitfcardCoffeeDto: CreateGitfcardCoffeeDto) {
    const findUser = await this.userRepository.findOne({
      where: { id: createGitfcardCoffeeDto.userId },
    });
    if (!findUser) throw new NotFoundException('User not found');

    const findProduct = await this.productRepository.findOne({
      where: { id: createGitfcardCoffeeDto.coffeeId },
    });

    if (!findProduct) throw new NotFoundException('Product not found');

    const giftCard = {
      cantidad: createGitfcardCoffeeDto.cantidad,
      img: createGitfcardCoffeeDto.img,
      user: findUser,
      code: generateUniqueCode(),
      product: findProduct,
    };

    const newGiftCard = await this.giftcardRepository.save(giftCard);

    const { user, code, ...gift } = newGiftCard;
    const { password, ...noPassUser } = user;
    return { gift, noPassUser, msg: 'Gift card created successfully' };
  }

  async findAll() {
    const allGiftCards = await this.giftcardRepository.find({
      relations: { product: true, user: true },
    });
    const giftCardNoCode = allGiftCards.map((g) => {
      const { code, user, ...returnG } = g;
      const { password, ...noPassUser } = user;
      return { ...returnG, user: noPassUser };
    });
    return giftCardNoCode;
  }

  async findOne(id: string) {
    const giftCard = await this.giftcardRepository.findOne({
      where: { id: id },
      relations: { product: true, user: true },
    });
    if (!giftCard) throw new NotFoundException('Giftcard not found');
    const { code, user, ...returnCard } = giftCard;
    const { password, ...noPassUser } = user;

    return { ...returnCard, user: noPassUser };
  }

  async update(id: string, updateGitfcardDto: UpdateGitfcardDto) {
    const giftCard = await this.giftcardRepository.preload({
      id: id,
      ...updateGitfcardDto,
    });
    if (!giftCard) throw new NotFoundException('Giftcard not found');

    const updatedGiftCard = await this.giftcardRepository.save(giftCard);
    const { code, ...returnCard } = updatedGiftCard;
    const { user, ...noPassUser } = updatedGiftCard;

    return { ...returnCard, user: noPassUser };
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
