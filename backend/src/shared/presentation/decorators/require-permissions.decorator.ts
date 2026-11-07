import { SetMetadata } from '@nestjs/common';
import type { Permission } from '../../../modules/users/domain/enums/permission.enum';

export const PERMISSIONS_KEY = 'permissions';

/** Exige que el usuario autenticado tenga todos los permisos indicados. */
export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
