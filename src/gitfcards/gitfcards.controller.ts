import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { GitfcardsService } from './gitfcards.service';
import { CreateGitfcardDto } from './dto/create-gitfcard.dto';
import { CreateGitfcardCoffeeDto } from './dto/create-gitfcardCoffe.dto';

@Controller('gitfcards')
export class GitfcardsController {
  constructor(private readonly gitfcardsService: GitfcardsService) {}

  @Post()
  create(@Body() createGitfcardDto: CreateGitfcardDto) {
    return this.gitfcardsService.create(createGitfcardDto);
  }

  @Post('cafe')
  giftCoffe(@Body() createGitfcardCoffeeDto: CreateGitfcardCoffeeDto) {
    return this.gitfcardsService.giftCoffe(createGitfcardCoffeeDto);
  }

  @Get()
  findAll() {
    return this.gitfcardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.gitfcardsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gitfcardsService.remove(id);
  }
}
