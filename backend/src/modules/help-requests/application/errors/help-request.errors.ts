import { ApplicationError } from '../../../../shared/application/errors/application.error';

export class HelpRequestNotFoundError extends ApplicationError {
  constructor() {
    super('HELP_REQUEST_NOT_FOUND', 'La solicitud de ayuda no existe.', 404);
  }
}
