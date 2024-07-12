import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/user/entities/user.entity';

@Injectable()
export class GuardRoles implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requestRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const hasRole = () =>
      requestRoles.some((role) => user?.role?.includes(role));

    const valid = user && user.role && hasRole();
    if (!valid) {
      throw new UnauthorizedException('Not access, not permission');
    }
    return valid;
  }
}
