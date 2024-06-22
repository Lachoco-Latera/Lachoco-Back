import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryName {
  @IsString()
  @IsNotEmpty()
  name: string;
}
