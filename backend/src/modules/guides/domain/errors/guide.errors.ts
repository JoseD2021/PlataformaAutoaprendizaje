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