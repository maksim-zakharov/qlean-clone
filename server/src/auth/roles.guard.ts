import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    console.log(requiredRoles);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    console.log(user);

    // Проверяем активную роль
    return requiredRoles.includes(user.role);
  }
}
export const Roles = Reflector.createDecorator<string[]>();
