import { DomainError } from '../../../../shared/domain/errors/domain.error';

export class InvalidGuideError extends DomainError {
  constructor(message: string) {
    super('INVALID_GUIDE', message, 'validation');
  }
}

export class InvalidGuideStepError extends DomainError {
  constructor(message: string) {
    super('INVALID_GUIDE_STEP', message, 'validation');
  }
}

export class InvalidSearchQueryError extends DomainError {
  constructor(message: string) {
    super('INVALID_SEARCH_QUERY', message, 'validation');
  }
}

export class CannotManageGuideError extends DomainError {
  constructor(message = 'No tienes permiso para gestionar guías.') {
    super('CANNOT_MANAGE_GUIDE', message, 'forbidden');
  }
}

export class InvalidGuideImageError extends DomainError {
  constructor(message: string) {
    super('INVALID_GUIDE_IMAGE', message, 'validation');
  }
}