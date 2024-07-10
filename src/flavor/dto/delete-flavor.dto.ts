import { IsUUID } from 'class-validator';

export class DeleteFlavorDto {
  @IsUUID()
  id: string;
}
