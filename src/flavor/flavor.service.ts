import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFlavorDto } from './dto/create-flavor.dto';
import { UpdateFlavorDto } from './dto/update-flavor.dto';
import { DeleteFlavorDto } from './dto/delete-flavor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Flavor } from './entities/flavor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FlavorService {
  constructor(
    @InjectRepository(Flavor) private flavorRepository: Repository<Flavor>,
  ) {}

  async create(createFlavorDto: CreateFlavorDto) {
    const newFlavor = await this.flavorRepository.save(createFlavorDto);
    return newFlavor;
  }

  async findAll() {
    return await this.flavorRepository.find();
  }

  async findOne(id: string) {
    const findFlavor = await this.flavorRepository.findOne({
      where: { id: id },
    });
    if (!findFlavor) throw new NotFoundException('Flavor not found');
    return findFlavor;
  }

  async remove(id: string) {
    const findFlavor = await this.flavorRepository.findOne({
      where: { id: id },
      relations: { products: true },
    });
    if (!findFlavor) throw new NotFoundException('Flavor not found');

    await this.flavorRepository.remove(findFlavor);

    return `This action removes a #${id} flavor`;
  }
}
