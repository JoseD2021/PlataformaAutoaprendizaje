import { DomainError } from '../../../../shared/domain/errors/domain.error';

export class InvalidHelpRequestError extends DomainError {
  constructor(message: string) {
    super('INVALID_HELP_REQUEST', message, 'validation');
  }
}
