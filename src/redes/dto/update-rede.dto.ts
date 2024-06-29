import { PartialType } from '@nestjs/swagger';
import { CreateRedeDto } from './create-rede.dto';

export class UpdateRedeDto extends PartialType(CreateRedeDto) {}
