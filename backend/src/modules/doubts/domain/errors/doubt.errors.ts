import { DomainError } from '../../../../shared/domain/errors/domain.error';

export class InvalidDoubtError extends DomainError {
  constructor(message: string) {
    super('INVALID_DOUBT', message, 'validation');
  }
}

export class CannotRecordDoubtError extends DomainError {
  constructor(message = 'No tienes permiso para anotar dudas.') {
    super('CANNOT_RECORD_DOUBT', message, 'forbidden');
  }
}
