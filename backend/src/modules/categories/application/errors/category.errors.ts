import { ApplicationError } from '../../../../shared/application/errors/application.error';

export class CategoryNotFoundError extends ApplicationError {
  constructor() {
    super('CATEGORY_NOT_FOUND', 'La categoría solicitada no existe.', 404);
  }
}