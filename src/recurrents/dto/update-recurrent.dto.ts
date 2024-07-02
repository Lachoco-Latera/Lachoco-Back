import { PartialType } from '@nestjs/swagger';
import { CreateRecurrentDto } from './create-recurrent.dto';

export class UpdateRecurrentDto extends PartialType(CreateRecurrentDto) {}
