import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { PaginationQuery } from 'src/dto/pagination.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  exampleCreatedUser,
  userAlreadyExists,
  userValidationsErrors,
} from './swagger.user';
import { userFavorites } from './dto/userFavorite.dto';
import { updateUserDto } from './dto/updateUser.dto';
import { GuardRoles } from 'src/guards/role.guard';
import { GuardToken } from 'src/guards/token.guard';
import { Role } from './entities/user.entity';
import { Roles } from 'src/decorators/userRole.decorator';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    schema: {
      example: exampleCreatedUser,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validacion fallida',
    schema: {
      example: userValidationsErrors,
    },
  })
  @ApiResponse(userAlreadyExists)
  @ApiOperation({
    summary: 'Registro de usuario',
    description: 'Registro de usuario',
  })
  @Post('/register')
  create(@Body() createUserDto: createUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('/login')
  @ApiResponse({
    status: 201,
    description: 'Inicio de sesion exitoso',
    schema: {
      example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlkIjoxLCJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IkFETUlOIn0.1',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
    schema: {
      example: {
        message: 'Usuario no encontrado',
        error: 'Bad Request',
      },
    },
  })
  @ApiOperation({
    summary: 'Inicio de sesion',
    description: 'Inicio de sesion',
  })
  signin(@Body() login: LoginDto) {
    return this.userService.loginUser(login);
  }

  @ApiResponse({
    status: 200,
    description: 'Listar todos los usuarios exitosamente',
    schema: {
      example: [exampleCreatedUser],
    },
  })
  @ApiOperation({
    summary: 'Listar todos los usuarios',
    description: 'Lista todos los usuarios en la base de datos',
  })
  @Get()
  findAll(@Query() pagination?: PaginationQuery) {
    return this.userService.findAll(pagination);
  }

  @Put('/admin/:id')
  @Roles(Role.ADMIN)
  @UseGuards(GuardToken, GuardRoles)
  createAdmin(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
    return this.userService.createAdmin(id);
  }

  @Put('/clien/:id')
  @Roles(Role.ADMIN)
  @UseGuards(GuardToken, GuardRoles)
  createClient(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
    return this.userService.createAdmin(id);
  }

  @Put('/inactive/:id')
  @Roles(Role.ADMIN)
  @UseGuards(GuardToken, GuardRoles)
  remove(@Param('id') id: string): Promise<string> {
    return this.userService.inactiveUser(id);
  }

  @Post('/favorite')
  favorite(@Body() favorite: userFavorites) {
    return this.userService.makeFavorite(favorite);
  }

  @Put('/RmFavorite')
  RemoveFavorite(@Body() userId: string, productId: string) {
    return this.userService.removeFavorite(userId, productId);
  }

  @ApiResponse({
    status: 200,
    description: 'Usuario por ID',
    schema: {
      example: [exampleCreatedUser],
    },
  })
  @ApiOperation({
    summary: 'Usuario Por ID',
    description: 'Usuario Por ID',
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  editUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUser: updateUserDto,
  ) {
    return this.userService.editUser(id, updateUser);
  }
}
