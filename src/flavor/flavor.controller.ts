import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FlavorService } from './flavor.service';
import { CreateFlavorDto } from './dto/create-flavor.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/userRole.decorator';
import { Role } from 'src/user/entities/user.entity';
import { GuardToken } from 'src/guards/token.guard';
import { GuardRoles } from 'src/guards/role.guard';

@Controller('flavor')
@ApiTags('flavor')
export class FlavorController {
  constructor(private readonly flavorService: FlavorService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(GuardToken, GuardRoles)
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
  @Roles(Role.ADMIN)
  @UseGuards(GuardToken, GuardRoles)
  remove(@Param('id') id: string) {
    return this.flavorService.remove(+id);
  }
}
