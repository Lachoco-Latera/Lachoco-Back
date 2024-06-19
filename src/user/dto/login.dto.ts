import { PickType } from '@nestjs/swagger';
import { createUserDto } from './create-user.dto';

export class LoginDto extends PickType(createUserDto, ['email', 'password']) {}
