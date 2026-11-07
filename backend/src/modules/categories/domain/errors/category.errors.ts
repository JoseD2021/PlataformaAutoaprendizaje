import { DomainError } from "../../../../shared/domain/errors/domain.error";

export class InvalidCategoryError extends DomainError {
  constructor(message: string) {
    super('INVALID_CATEGORY', message);
  }
}

export class CannotManageCategoryError extends DomainError {
  constructor(message = 'No puedes administrar esta categoría.') {
    super('CANNOT_MANAGE_CATEGORY', message, 'forbidden');
  }
}