import { IsString, IsOptional, IsEmail, IsPhoneNumber } from 'class-validator';

export class UserDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber(null)
  phone: string;

  @IsString()
  street: string;

  @IsString()
  number: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  country: string;

  @IsString()
  postalCode: string;
}

export class CreateShipmentDto {
  user: UserDto;

  @IsString()
  country: string;

  @IsString()
  carrier: string;
}
