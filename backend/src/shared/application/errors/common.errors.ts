import { ApplicationError } from './application.error';

export class UnauthorizedError extends ApplicationError {
  constructor(message = 'Debes iniciar sesión para acceder a este recurso.') {
    super('AUTH_REQUIRED', message, 401);
  }
}

export class ForbiddenOperationError extends ApplicationError {
  constructor(message = 'No tienes permisos para realizar esta operación.', details?: unknown) {
    super('FORBIDDEN', message, 403, details);
  }
}
