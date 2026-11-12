import { ListFavoritesUseCase } from './list-favorites.use-case';
import { GuideStatus } from '../../../guides/domain/enums/guide-status.enum';
import {
  InMemoryFavoriteRepository,
  InMemoryGuideRepository,
  makeFavorite,
  makeGuide,
} from '../../../../../test/support/fakes';

describe('ListFavoritesUseCase', () => {
  it('devuelve las guías favoritas de la más reciente a la más antigua', async () => {
    const guides = new InMemoryGuideRepository([
      makeGuide({ id: 'enviar-correo-foto', title: 'Enviar un correo con una foto' }),
      makeGuide({ id: 'imprimir-documento', title: 'Imprimir un documento' }),
    ]);
    const favorites = new InMemoryFavoriteRepository([
      makeFavorite({
        userId: 'user-1',
        guideId: 'enviar-correo-foto',
        now: new Date('2026-01-01T00:00:00Z'),
      }),
      makeFavorite({
        userId: 'user-1',
        guideId: 'imprimir-documento',
        now: new Date('2026-01-02T00:00:00Z'),
      }),
    ]);
    const useCase = new ListFavoritesUseCase(favorites, guides);

    const result = await useCase.execute('user-1');

    expect(result.map((g) => g.id)).toEqual(['imprimir-documento', 'enviar-correo-foto']);
  });

  it('ignora favoritos de guías eliminadas o despublicadas', async () => {
    const guides = new InMemoryGuideRepository([
      makeGuide({ id: 'borrador', status: GuideStatus.DRAFT }),
    ]);
    const favorites = new InMemoryFavoriteRepository([
      makeFavorite({ userId: 'user-1', guideId: 'borrador' }),
      makeFavorite({ userId: 'user-1', guideId: 'eliminada' }),
    ]);
    const useCase = new ListFavoritesUseCase(favorites, guides);

    const result = await useCase.execute('user-1');

    expect(result).toEqual([]);
  });

  it('devuelve vacío si el usuario no tiene favoritos', async () => {
    const useCase = new ListFavoritesUseCase(
      new InMemoryFavoriteRepository(),
      new InMemoryGuideRepository(),
    );

    expect(await useCase.execute('user-1')).toEqual([]);
  });
});
