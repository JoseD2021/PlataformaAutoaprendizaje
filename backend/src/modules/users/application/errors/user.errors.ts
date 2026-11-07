import { ApplicationError } from '../../../../shared/application/errors/application.error';
import type { Role } from '../../domain/enums/role.enum';

export class EmailAlreadyInUseError extends ApplicationError {
  constructor(email: string) {
    super('EMAIL_ALREADY_IN_USE', `Ya existe un usuario registrado con el correo ${email}.`, 409);
  }
}

export class UserNotFoundError extends ApplicationError {
  constructor() {
    super('USER_NOT_FOUND', 'El usuario solicitado no existe.', 404);
  }
}

export class RoleNotFoundError extends ApplicationError {
  constructor(role: Role) {
    super('ROLE_NOT_FOUND', `La definición del rol "${role}" no existe.`, 404);
  }
}

export class RoleAlreadyExistsError extends ApplicationError {
  constructor(role: Role) {
    super('ROLE_ALREADY_EXISTS', `Ya existe un rol con el identificador "${role}".`, 409);
  }
}

export class RoleInUseError extends ApplicationError {
  constructor(role: Role) {
    super(
      'ROLE_IN_USE',
      `No se puede eliminar el rol "${role}" porque tiene usuarios asignados.`,
      409,
    );
  }
}
