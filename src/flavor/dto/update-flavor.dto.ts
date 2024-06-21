import { PartialType } from '@nestjs/swagger';
import { CreateFlavorDto } from './create-flavor.dto';

export class UpdateFlavorDto extends PartialType(CreateFlavorDto) {}
