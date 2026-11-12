import { ApplicationError } from '../../../../shared/application/errors/application.error';

export class FavoriteGuideNotFoundError extends ApplicationError {
  constructor() {
    super(
      'FAVORITE_GUIDE_NOT_FOUND',
      'La guía que intentas marcar como favorita no existe.',
      404,
    );
  }
}
