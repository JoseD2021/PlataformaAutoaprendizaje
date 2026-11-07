import { ApplicationError } from '../../../../shared/application/errors/application.error';

export class CategoryNotFoundError extends ApplicationError {
  constructor() {
    super('CATEGORY_NOT_FOUND', 'La categoría solicitada no existe.', 404);
  }
}

export class CategorySlugAlreadyExistsError extends ApplicationError {
  constructor() {
    super(
      'CATEGORY_SLUG_ALREADY_EXISTS',
      'Ya existe una categoría con un nombre demasiado parecido.',
      409,
    );
  }
}