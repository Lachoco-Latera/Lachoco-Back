import { createUserDto } from './create-user.dto';
declare const LoginDto_base: import("@nestjs/common").Type<Pick<createUserDto, "email" | "password">>;
export declare class LoginDto extends LoginDto_base {
}
export {};
