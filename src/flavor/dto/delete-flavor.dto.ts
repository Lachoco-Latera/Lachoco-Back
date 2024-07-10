import { IsUUID } from 'class-validator';

export class CreateFlavorDto {
  @IsUUID()
  id: string;
}
