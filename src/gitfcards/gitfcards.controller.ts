import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { GitfcardsService } from './gitfcards.service';
import { CreateGitfcardDto } from './dto/create-gitfcard.dto';
import { UpdateGitfcardDto } from './dto/update-gitfcard.dto';
import { CreateGitfcardCoffeeDto } from './dto/create-gitfcardCoffe.dto';
import { Roles } from 'src/decorators/userRole.decorator';
import { Role } from 'src/user/entities/user.entity';
import { GuardToken } from 'src/guards/token.guard';
import { GuardRoles } from 'src/guards/role.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Gitfcards')
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

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGitfcardDto: UpdateGitfcardDto,
  ) {
    return this.gitfcardsService.update(id, updateGitfcardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gitfcardsService.remove(id);
  }
}
