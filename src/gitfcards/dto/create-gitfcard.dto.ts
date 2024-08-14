import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateGitfcardDto {
  /**
   * @example '200'
   * @description Monto a regalar
   */
  @IsNumber()
  @IsNotEmpty()
  discount: number;

  /**
   * @example 'blob:https://lachoco-latera.atlassian.net/f9a2e907-894b-4c3f-bcac-132522532073'
   * @description Link de imagen opcional
   */
  @IsString()
  @IsOptional()
  img?: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'Id de usuario a quien asignar giftcard',
    example: '887a8887-598b-4240-a7da-4c751a9ab2d3',
  })
  userId: string;
}
