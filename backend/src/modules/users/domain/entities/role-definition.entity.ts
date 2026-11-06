import { ROLE_SLUG_PATTERN } from '../constants/role-slug';
import type { Permission } from '../enums/permission.enum';
import type { Role } from '../enums/role.enum';
import { CannotModifyRolePermissionsError, InvalidRoleError } from '../errors/user.errors';

const MIN_ROLE_NAME_LENGTH = 2;
const MAX_ROLE_NAME_LENGTH = 80;

export interface RoleDefinitionProps {
  role: Role;
  name: string;
  rank: number;
  permissions: Permission[];
  updatedAt?: Date;
}

export interface CreateRoleDefinitionProps {
  role: Role;
  name: string;
  rank: number;
  permissions?: Permission[];
  updatedAt?: Date;
}

export class RoleDefinition {
  private permissionSet: Set<Permission>;
  private propsUpdatedAt: Date;

  constructor(
    readonly role: Role,
    readonly name: string,
    readonly rank: number,
    permissions: Permission[],
    updatedAt: Date = new Date(),
  ) {
    this.permissionSet = new Set(permissions);
    this.propsUpdatedAt = updatedAt;
  }

  static create(props: CreateRoleDefinitionProps): RoleDefinition {
    const role = props.role.trim().toLowerCase();
    const name = typeof props.name === 'string' ? props.name.trim() : '';

    if (!ROLE_SLUG_PATTERN.test(role)) {
      throw new InvalidRoleError(
        'El identificador del rol debe comenzar con una letra y solo puede contener minúsculas, números, guiones y guiones bajos (máximo 32 caracteres).',
      );
    }

    if (name.length < MIN_ROLE_NAME_LENGTH || name.length > MAX_ROLE_NAME_LENGTH) {
      throw new InvalidRoleError(
        `El nombre del rol debe tener entre ${MIN_ROLE_NAME_LENGTH} y ${MAX_ROLE_NAME_LENGTH} caracteres.`,
      );
    }

    if (!Number.isInteger(props.rank) || props.rank < 1) {
      throw new InvalidRoleError('La jerarquía del rol debe ser un número entero mayor que cero.');
    }

    return new RoleDefinition(
      role,
      name,
      props.rank,
      props.permissions ?? [],
      props.updatedAt ?? new Date(),
    );
  }

  static rehydrate(props: RoleDefinitionProps): RoleDefinition {
    return new RoleDefinition(
      props.role,
      props.name,
      props.rank,
      props.permissions,
      props.updatedAt ?? new Date(),
    );
  }

  get permissions(): Permission[] {
    return [...this.permissionSet];
  }

  get updatedAt(): Date {
    return this.propsUpdatedAt;
  }

  has(permission: Permission): boolean {
    return this.permissionSet.has(permission);
  }

  /**
   * Solo un rol con rank estrictamente mayor puede modificar los permisos de
   * este rol. Así el administrador no puede quitarse permisos a sí mismo y
   * siempre quedan roles inferiores editables.
   */
  updatePermissions(permissions: Permission[], actorRank: number, now: Date = new Date()): void {
    if (actorRank <= this.rank) {
      throw new CannotModifyRolePermissionsError(this.role);
    }

    this.permissionSet = new Set(permissions);
    this.propsUpdatedAt = now;
  }
}
