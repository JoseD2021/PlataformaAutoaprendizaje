import type { Permission } from '../../../modules/users/domain/enums/permission.enum';
import type { Role } from '../../../modules/users/domain/enums/role.enum';

/**
 * Identidad resuelta en cada petición autenticada.
 *
 * Los permisos se cargan desde la definición actual del rol, de modo que los
 * cambios de permisos/rol del administrador aplican sin esperar a que expire
 * el access token.
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  roleName: string;
  roleRank: number;
  permissions: Permission[];
}
