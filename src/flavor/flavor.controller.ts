import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FlavorService } from './flavor.service';
import { CreateFlavorDto } from './dto/create-flavor.dto';
import { UpdateFlavorDto } from './dto/update-flavor.dto';
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
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.flavorService.findOne(id);
  }

  @Put(':id') // Cambia @Patch a @Put aquí
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFlavorDto: UpdateFlavorDto,
  ) {
    return this.flavorService.update(id, updateFlavorDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.flavorService.remove(id);
  }
}
