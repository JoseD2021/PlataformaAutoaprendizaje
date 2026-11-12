import { ApplicationError } from '../../../../shared/application/errors/application.error';

export class GuideNotFoundError extends ApplicationError {
  constructor() {
    super('GUIDE_NOT_FOUND', 'La guía solicitada no existe.', 404);
  }
}

export class GuideAlreadyExistsError extends ApplicationError {
  constructor() {
    super('GUIDE_ALREADY_EXISTS', 'Ya existe una guía con un título demasiado parecido.', 409);
  }
}

export class GuideCategoryNotFoundError extends ApplicationError {
  constructor() {
    super('GUIDE_CATEGORY_NOT_FOUND', 'La categoría indicada no existe.', 422);
  }
}

export class GuideImageNotFoundError extends ApplicationError {
  constructor() {
    super('GUIDE_IMAGE_NOT_FOUND', 'La imagen solicitada no existe.', 404);
  }
}