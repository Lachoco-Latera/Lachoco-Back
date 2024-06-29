import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRedeDto } from './dto/create-rede.dto';
import { UpdateRedeDto } from './dto/update-rede.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Redes } from './entities/rede.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RedesService {
  constructor(
    @InjectRepository(Redes) private redesRepository: Repository<Redes>,
  ) {}
  async create(createRedeDto: CreateRedeDto) {
    const postRede = await this.redesRepository.save(createRedeDto);
    return postRede;
  }

  async findAll() {
    return await this.redesRepository.find();
  }

  async findOne(id: string) {
    const red = await this.redesRepository.findOne({ where: { id: id } });
    if (!red) throw new NotFoundException('Redes not found');

    return red;
  }

  async update(id: string, updateRedeDto: UpdateRedeDto) {
    const red = await this.redesRepository.findOne({ where: { id: id } });
    if (!red) throw new NotFoundException('Redes not found');

    await this.redesRepository.update({ id: id }, { ...updateRedeDto });

    return `This action updates a #${id} rede`;
  }

  async remove(id: string) {
    const red = await this.redesRepository.findOne({ where: { id: id } });
    if (!red) throw new NotFoundException('Redes not found');

    await this.redesRepository.delete(id);
    return `This action removes a #${id} rede`;
  }
}
