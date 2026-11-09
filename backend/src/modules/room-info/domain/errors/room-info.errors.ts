import { DomainError } from '../../../../shared/domain/errors/domain.error';

export class InvalidRoomInfoError extends DomainError {
  constructor(message: string) {
    super('INVALID_ROOM_INFO', message, 'validation');
  }
}

export class CannotManageRoomInfoError extends DomainError {
  constructor(message = 'No tienes permiso para modificar la información de la sala.') {
    super('CANNOT_MANAGE_ROOM_INFO', message, 'forbidden');
  }
}