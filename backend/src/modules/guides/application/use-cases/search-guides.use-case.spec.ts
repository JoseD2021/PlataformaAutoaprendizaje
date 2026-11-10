import { InvalidSearchQueryError } from '../../domain/errors/guide.errors';
import { GuideRepository } from '../../domain/repositories/guide.repository';
import { SearchGuidesUseCase } from './search-guides.use-case';

describe('SearchGuidesUseCase', () => {
  const hit = {
    id: '1',
    title: 'Enviar archivos por correo',
    estimatedMinutes: 5,
    categoryName: 'Correo',
    score: 0.9,
  };

  const makeRepo = (total: number): GuideRepository =>
    ({
      search: jest.fn().mockResolvedValue({
        total,
        items: total ? [hit] : [],
      }),
    }) as unknown as GuideRepository;

  it('pasa los tokens normalizados y la categoría al repositorio', async () => {
    const repo = makeRepo(1);

    await new SearchGuidesUseCase(repo).execute({
      q: 'Mandar una FOTO',
      categoryId: 'cat-correo',
      page: 1,
      limit: 10,
    });

    const criteria = (repo.search as jest.Mock).mock.calls[0][0];
    expect(criteria.query.tokens).toEqual(['mandar', 'foto']);
    expect(criteria.categoryId).toBe('cat-correo');
    expect(criteria.page).toBe(1);
    expect(criteria.limit).toBe(10);
  });

  it('devuelve los resultados sin exponer el score y arma la paginación', async () => {
    const result = await new SearchGuidesUseCase(makeRepo(25)).execute({
      q: 'mandar una foto',
      page: 2,
      limit: 10,
    });

    expect(result.items).toEqual([
      {
        id: '1',
        title: 'Enviar archivos por correo',
        estimatedMinutes: 5,
        categoryName: 'Correo',
      },
    ]);
    expect(result.total).toBe(25);
    expect(result.page).toBe(2);
    expect(result.totalPages).toBe(3);
  });

  it('devuelve lista vacía cuando no hay guías', async () => {
    const result = await new SearchGuidesUseCase(makeRepo(0)).execute({
      q: 'xyzxyz',
      page: 1,
      limit: 10,
    });

    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(0);
  });

  it('rechaza una búsqueda inválida sin consultar el repositorio', async () => {
    const repo = makeRepo(1);

    await expect(
      new SearchGuidesUseCase(repo).execute({ q: ' a ', page: 1, limit: 10 }),
    ).rejects.toThrow(InvalidSearchQueryError);

    const searchMock = repo['search'] as jest.Mock;
    expect(searchMock).not.toHaveBeenCalled();
  });
});