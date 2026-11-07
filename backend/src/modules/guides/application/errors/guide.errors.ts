import { ApplicationError } from '../../../../shared/application/errors/application.error';

export class GuideNotFoundError extends ApplicationError {
  constructor() {
    super('GUIDE_NOT_FOUND', 'La guía solicitada no existe.', 404);
  }
}