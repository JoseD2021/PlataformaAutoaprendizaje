import { DomainError } from '../../../../shared/domain/errors/domain.error';

export class InvalidRoomInfoError extends DomainError {
  constructor(message: string) {
    super('INVALID_ROOM_INFO', message, 'validation');
  }
}