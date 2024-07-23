import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFlavorDto } from './dto/create-flavor.dto';
import { UpdateFlavorDto } from './dto/update-flavor.dto';
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

  async update(id: string, updateFlavorDto: UpdateFlavorDto) {
    const flavor = await this.flavorRepository.preload({
      id: id,
      ...updateFlavorDto,
    });
    if (!flavor) throw new NotFoundException('Flavor not found');
    return this.flavorRepository.save(flavor);
  }

  async remove(id: string) {
    try {
      const flavorToRemove = await this.flavorRepository.findOneOrFail({
        where: { id: id },
      });
      await this.flavorRepository.remove(flavorToRemove);
      return `Flavor with ID ${id} has been successfully removed`;
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`Flavor with ID ${id} not found`);
      }
      throw error; // throw other unexpected errors
    }
  }
}
