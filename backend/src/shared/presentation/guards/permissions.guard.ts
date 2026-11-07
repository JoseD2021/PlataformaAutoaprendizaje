import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { ForbiddenOperationError, UnauthorizedError } from '../../application/errors/common.errors';
import type { AuthenticatedUser } from '../../application/models/authenticated-user.model';
import type { Permission } from '../../../modules/users/domain/enums/permission.enum';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';

type AuthenticatedRequest = Request & { user?: AuthenticatedUser };

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const required = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedError();
    }

    const missingPermissions = required.filter(
      (permission) => !user.permissions.includes(permission),
    );

    if (missingPermissions.length > 0) {
      throw new ForbiddenOperationError(
        'No tienes los permisos requeridos para esta operación.',
        { missingPermissions },
      );
    }

    return true;
  }
}
