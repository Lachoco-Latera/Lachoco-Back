import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FlavorService } from './flavor.service';
import { CreateFlavorDto } from './dto/create-flavor.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('flavor')
@ApiTags('flavor')
export class FlavorController {
  constructor(private readonly flavorService: FlavorService) {}

  @Post()
  create(@Body() createFlavorDto: CreateFlavorDto) {
    return this.flavorService.create(createFlavorDto);
  }

  @Get()
  findAll() {
    return this.flavorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flavorService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flavorService.remove(+id);
  }
}
