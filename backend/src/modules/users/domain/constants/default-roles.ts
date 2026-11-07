import { ALL_PERMISSIONS, Permission } from '../enums/permission.enum';
import { Role } from '../enums/role.enum';

export interface DefaultRoleDefinition {
  role: Role;
  name: string;
  rank: number;
  permissions: Permission[];
}

/**
 * Jerarquía y permisos iniciales.
 *
 * El administrador solo puede modificar permisos de roles con un rank
 * estrictamente menor al suyo (roles inferiores). Estas definiciones se
 * siembran en base de datos y luego pueden ajustarse mediante la API.
 */
export const DEFAULT_ROLES: DefaultRoleDefinition[] = [
  {
    role: Role.ADMINISTRADOR,
    name: 'Administrador',
    rank: 30,
    permissions: [...ALL_PERMISSIONS],
  },
  {
    role: Role.PERSONAL_CLENA,
    name: 'Personal del CLENA',
    rank: 20,
    permissions: [
      Permission.USERS_READ,
      Permission.SESSIONS_READ_ONLINE,
      Permission.HELP_REQUESTS_READ,
    ],
  },
  {
    role: Role.USUARIO,
    name: 'Usuario común',
    rank: 10,
    permissions: [Permission.FAVORITES_MANAGE, Permission.HELP_REQUESTS_CREATE],
  },
];
