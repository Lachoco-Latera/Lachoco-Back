import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFlavorDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
