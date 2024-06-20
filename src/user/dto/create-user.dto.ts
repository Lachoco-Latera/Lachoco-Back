import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { ConfirmPass } from 'src/decorators/confirmPassword.decorator';

export class createUserDto {
  /**
   * @example 'Maria'
   * @description Name of the user
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * @example 'Perez'
   * @description Lastname of the user
   */
  @IsString()
  @IsNotEmpty()
  lastname: string;

  /**
   * @example 'MariaEpa@gmail.com'
   * @description Email of the user
   */
  @IsString()
  @IsNotEmpty()
  email: string;

  /**
   * @example 'Colombia'
   * @description Location
   */
  @IsString()
  @IsNotEmpty()
  country: string;

  /**
   * @example 'P@asw0rd'
   * @description Password of the user
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(15)
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  /**
   * @example 'P@asw0rd'
   * @description Has to match with password
   */
  @IsString()
  @IsNotEmpty()
  @Validate(ConfirmPass, ['password'])
  confirmPassword: string;
}
