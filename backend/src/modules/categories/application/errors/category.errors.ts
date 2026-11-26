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

export class CategoryAlreadyFeaturedError extends ApplicationError {
  constructor() {
    super(
      'CATEGORY_ALREADY_FEATURED',
      'Ya existe una categoría destacada. Desmárcala antes de destacar otra.',
      409,
    );
  }
}