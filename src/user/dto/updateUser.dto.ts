import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { ConfirmPass } from 'src/decorators/confirmPassword.decorator';

export class updateUserDto {
  /**
   * @example 'Maria'
   * @description Name of the user
   */
  @IsString()
  @IsOptional()
  name?: string;

  /**
   * @example 'Perez'
   * @description Lastname of the user
   */
  @IsString()
  @IsOptional()
  lastname?: string;

  /**
   * @example 'MariaEpa@gmail.com'
   * @description Email of the user
   */
  @IsString()
  @IsOptional()
  email?: string;

  /**
   * @example 'Colombia'
   * @description Location
   */
  @IsString()
  @IsOptional()
  country?: string;

  /**
   * @example 'P@asw0rd'
   * @description Password of the user
   */
  @IsString()
  @IsOptional()
  @MinLength(8)
  @MaxLength(15)
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password?: string;

  /**
   * @example 'P@asw0rd'
   * @description Has to match with password
   */
  @IsString()
  @IsOptional()
  @Validate(ConfirmPass, ['password'])
  confirmPassword?: string;
}
