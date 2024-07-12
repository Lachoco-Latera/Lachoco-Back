import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RedesService } from './redes.service';
import { CreateRedeDto } from './dto/create-rede.dto';
import { UpdateRedeDto } from './dto/update-rede.dto';
import { GuardRoles } from 'src/guards/role.guard';
import { GuardToken } from 'src/guards/token.guard';
import { Role } from 'src/user/entities/user.entity';
import { Roles } from 'src/decorators/userRole.decorator';

@Controller('redes')
export class RedesController {
  constructor(private readonly redesService: RedesService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(GuardToken, GuardRoles)
  create(@Body() createRedeDto: CreateRedeDto) {
    return this.redesService.create(createRedeDto);
  }

  @Get()
  findAll() {
    return this.redesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.redesService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(GuardToken, GuardRoles)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRedeDto: UpdateRedeDto,
  ) {
    return this.redesService.update(id, updateRedeDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(GuardToken, GuardRoles)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.redesService.remove(id);
  }
}
