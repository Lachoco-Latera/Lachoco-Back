import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecurrentsService } from './recurrents.service';
import { CreateRecurrentDto } from './dto/create-recurrent.dto';
import { UpdateRecurrentDto } from './dto/update-recurrent.dto';

@Controller('recurrents')
export class RecurrentsController {
  constructor(private readonly recurrentsService: RecurrentsService) {}

  @Post()
  create(@Body() createRecurrentDto: CreateRecurrentDto) {
    return this.recurrentsService.create(createRecurrentDto);
  }

  @Get()
  findAll() {
    return this.recurrentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recurrentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecurrentDto: UpdateRecurrentDto) {
    return this.recurrentsService.update(+id, updateRecurrentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recurrentsService.remove(+id);
  }
}
