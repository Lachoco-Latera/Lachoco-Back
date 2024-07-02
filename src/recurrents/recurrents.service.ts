import { Injectable } from '@nestjs/common';
import { CreateRecurrentDto } from './dto/create-recurrent.dto';
import { UpdateRecurrentDto } from './dto/update-recurrent.dto';

@Injectable()
export class RecurrentsService {
  create(createRecurrentDto: CreateRecurrentDto) {
    return 'This action adds a new recurrent';
  }

  findAll() {
    return `This action returns all recurrents`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recurrent`;
  }

  update(id: number, updateRecurrentDto: UpdateRecurrentDto) {
    return `This action updates a #${id} recurrent`;
  }

  remove(id: number) {
    return `This action removes a #${id} recurrent`;
  }
}
