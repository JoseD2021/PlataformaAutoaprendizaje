import { ApplicationError } from '../../../../shared/application/errors/application.error';

export class DoubtCategoryNotFoundError extends ApplicationError {
  constructor() {
    super('DOUBT_CATEGORY_NOT_FOUND', 'El tema indicado para la duda no existe.', 404);
  }
}

export class DoubtNotFoundError extends ApplicationError {
  constructor() {
    super('DOUBT_NOT_FOUND', 'La duda ya no está registrada.', 404);
  }
}
