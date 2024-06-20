import { IsNotEmpty, IsString } from 'class-validator';

export class userFavorites {
  /**
   * @example '427468a5-c56d-4768-9f89-51a1a04c7ffb'
   * @description ID of the user
   */
  @IsString()
  @IsNotEmpty()
  userId: string;

  /**
   * @example '["427468a5-c56d-4768-9f89-51a1a04c7ffb","427468a5-c56d-4768-9f89-51a1a04c7123"]'
   * @description ID products
   */
  @IsString()
  @IsNotEmpty()
  productId: string;
}
