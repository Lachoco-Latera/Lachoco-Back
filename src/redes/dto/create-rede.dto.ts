import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateRedeDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  img: string;
}
