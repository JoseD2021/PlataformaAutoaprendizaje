import { DomainError } from '../../../../shared/domain/errors/domain.error';
import type { Role } from '../enums/role.enum';

export class InvalidEmailError extends DomainError {
  constructor() {
    super('INVALID_EMAIL', 'El correo electrónico no tiene un formato válido.');
  }
}

export class InvalidUserError extends DomainError {
  constructor(message: string) {
    super('INVALID_USER', message);
  }
}

export class CannotManageUserError extends DomainError {
  constructor(message = 'No puedes administrar a este usuario.') {
    super('CANNOT_MANAGE_USER', message, 'forbidden');
  }
}

export class CannotAssignRoleError extends DomainError {
  constructor(role: Role) {
    super(
      'CANNOT_ASSIGN_ROLE',
      `No puedes asignar el rol "${role}" porque es igual o superior al tuyo.`,
      'forbidden',
    );
  }
}

export class CannotModifyRolePermissionsError extends DomainError {
  constructor(role: Role) {
    super(
      'CANNOT_MODIFY_ROLE_PERMISSIONS',
      `Solo puedes modificar los permisos de roles inferiores; el rol "${role}" no lo es.`,
      'forbidden',
    );
  }
}

export class InvalidRoleError extends DomainError {
  constructor(message: string) {
    super('INVALID_ROLE', message);
  }
}

export class CannotManageRoleError extends DomainError {
  constructor(
    message = 'No puedes administrar un rol con una jerarquía igual o superior a la tuya.',
  ) {
    super('CANNOT_MANAGE_ROLE', message, 'forbidden');
  }
}

export class ReservedRoleError extends DomainError {
  constructor(role: Role) {
    super(
      'RESERVED_ROLE',
      `El rol "${role}" es necesario para el funcionamiento del sistema y no se puede eliminar.`,
      'conflict',
    );
  }
}

export class CannotGrantPermissionsError extends DomainError {
  constructor(permissions: string[]) {
    super(
      'CANNOT_GRANT_PERMISSIONS',
      `No puedes otorgar permisos que no tienes: ${permissions.join(', ')}.`,
      'forbidden',
    );
  }
}
