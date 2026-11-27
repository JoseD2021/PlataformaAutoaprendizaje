import { Permission } from '../enums/permission.enum';

export const RANGO_MINIMO_POR_PERMISO: Record<Permission, number> = {
  [Permission.USERS_CREATE]: 30,
  [Permission.USERS_READ]: 20,
  [Permission.USERS_UPDATE_ROLE]: 30,
  [Permission.USERS_DELETE]: 30,
  [Permission.ROLES_READ]: 20,
  [Permission.ROLES_CREATE]: 30,
  [Permission.ROLES_DELETE]: 30,
  [Permission.ROLES_UPDATE_PERMISSIONS]: 30,
  [Permission.CATEGORIES_CREATE]: 20,
  [Permission.CATEGORIES_MANAGE]: 20,
  [Permission.GUIDES_CREATE]: 20,
  [Permission.GUIDES_MANAGE]: 20,
  [Permission.SESSIONS_READ_ONLINE]: 20,
  [Permission.HELP_REQUESTS_READ]: 20,
  [Permission.HELP_REQUESTS_CREATE]: 10,
  [Permission.FAVORITES_MANAGE]: 10,
  [Permission.ROOM_INFO_MANAGE]: 20,
  [Permission.PRIVACY_TERMS_MANAGE]: 20,
};

export function permisosIncompatiblesConRango(
  rank: number,
  permissions: Permission[],
): Permission[] {
  return permissions.filter((permission) => rank < RANGO_MINIMO_POR_PERMISO[permission]);
}
