import { IsUUID } from 'class-validator';

export class DeleteOrderDto {
  @IsUUID()
  id: string;
}
