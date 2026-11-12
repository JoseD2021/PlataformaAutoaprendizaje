import { RemoveFavoriteUseCase } from './remove-favorite.use-case';
import { InMemoryFavoriteRepository, makeFavorite } from '../../../../../test/support/fakes';

describe('RemoveFavoriteUseCase', () => {
  it('quita la guía de los favoritos del usuario', async () => {
    const favorites = new InMemoryFavoriteRepository([makeFavorite()]);
    const useCase = new RemoveFavoriteUseCase(favorites);

    await useCase.execute({ userId: 'user-1', guideId: 'enviar-correo-foto' });

    expect(await favorites.exists('user-1', 'enviar-correo-foto')).toBe(false);
  });

  it('no falla si el favorito no existía', async () => {
    const favorites = new InMemoryFavoriteRepository();
    const useCase = new RemoveFavoriteUseCase(favorites);

    await expect(
      useCase.execute({ userId: 'user-1', guideId: 'no-existe' }),
    ).resolves.toBeUndefined();
  });
});
