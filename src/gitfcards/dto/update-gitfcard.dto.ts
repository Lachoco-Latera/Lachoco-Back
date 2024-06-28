import { PartialType } from '@nestjs/swagger';
import { CreateGitfcardDto } from './create-gitfcard.dto';

export class UpdateGitfcardDto extends PartialType(CreateGitfcardDto) {}
