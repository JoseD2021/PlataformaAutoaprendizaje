import { ApplicationError } from '../../../../shared/application/errors/application.error';

export class InvalidCredentialsError extends ApplicationError {
  constructor() {
    super('INVALID_CREDENTIALS', 'El correo o la contraseña son incorrectos.', 401);
  }
}

export class InvalidTokenError extends ApplicationError {
  constructor(message = 'El token es inválido o ha expirado.') {
    super('INVALID_TOKEN', message, 401);
  }
}
