import { AddFavoriteUseCase } from './add-favorite.use-case';
import { FavoriteGuideNotFoundError } from '../errors/favorite.errors';
import { GuideStatus } from '../../../guides/domain/enums/guide-status.enum';
import {
  InMemoryFavoriteRepository,
  InMemoryGuideRepository,
  makeFavorite,
  makeGuide,
} from '../../../../../test/support/fakes';

describe('AddFavoriteUseCase', () => {
  it('agrega la guía a favoritos si existe y está publicada', async () => {
    const guides = new InMemoryGuideRepository([makeGuide({ id: 'enviar-correo-foto' })]);
    const favorites = new InMemoryFavoriteRepository();
    const useCase = new AddFavoriteUseCase(favorites, guides);

    await useCase.execute({ userId: 'user-1', guideId: 'enviar-correo-foto' });

    expect(await favorites.exists('user-1', 'enviar-correo-foto')).toBe(true);
  });

  it('no duplica el favorito si ya existía', async () => {
    const guides = new InMemoryGuideRepository([makeGuide({ id: 'enviar-correo-foto' })]);
    const favorites = new InMemoryFavoriteRepository([makeFavorite()]);
    const useCase = new AddFavoriteUseCase(favorites, guides);

    await useCase.execute({ userId: 'user-1', guideId: 'enviar-correo-foto' });

    expect(favorites.all).toHaveLength(1);
  });

  it('lanza FavoriteGuideNotFoundError si la guía no existe', async () => {
    const useCase = new AddFavoriteUseCase(
      new InMemoryFavoriteRepository(),
      new InMemoryGuideRepository(),
    );

    await expect(
      useCase.execute({ userId: 'user-1', guideId: 'no-existe' }),
    ).rejects.toBeInstanceOf(FavoriteGuideNotFoundError);
  });

  it('lanza FavoriteGuideNotFoundError si la guía está en borrador', async () => {
    const guides = new InMemoryGuideRepository([
      makeGuide({ id: 'borrador', status: GuideStatus.DRAFT }),
    ]);
    const useCase = new AddFavoriteUseCase(new InMemoryFavoriteRepository(), guides);

    await expect(
      useCase.execute({ userId: 'user-1', guideId: 'borrador' }),
    ).rejects.toBeInstanceOf(FavoriteGuideNotFoundError);
  });
});
