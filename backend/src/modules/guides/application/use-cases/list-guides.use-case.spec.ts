import { ListGuidesUseCase } from './list-guides.use-case';
import { GuideStatus } from '../../domain/enums/guide-status.enum';
import { InMemoryGuideRepository, makeGuide } from '../../../../../test/support/fakes';

describe('ListGuidesUseCase', () => {
  const buildRepository = () =>
    new InMemoryGuideRepository([
      makeGuide({ id: 'entrar-correo', title: 'Entrar a mi correo', categoryId: 'correo' }),
      makeGuide({
        id: 'enviar-correo-foto',
        title: 'Enviar un correo con una foto',
        categoryId: 'correo',
        isMostRequested: true,
      }),
      makeGuide({ id: 'escribir-carta', title: 'Escribir una carta', categoryId: 'documentos' }),
      makeGuide({
        id: 'guia-en-borrador',
        title: 'Guía en borrador',
        categoryId: 'correo',
        status: GuideStatus.DRAFT,
      }),
    ]);

  it('lista solo guías publicadas y pone primero las más pedidas', async () => {
    const useCase = new ListGuidesUseCase(buildRepository());

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.total).toBe(3);
    expect(result.items.map((item) => item.id)).toEqual([
      'enviar-correo-foto',
      'entrar-correo',
      'escribir-carta',
    ]);
  });

  it('filtra por categoría', async () => {
    const useCase = new ListGuidesUseCase(buildRepository());

    const result = await useCase.execute({ page: 1, limit: 10, categoryId: 'documentos' });

    expect(result.items.map((item) => item.id)).toEqual(['escribir-carta']);
  });

  it('filtra por palabra clave en el título', async () => {
    const useCase = new ListGuidesUseCase(buildRepository());

    const result = await useCase.execute({ page: 1, limit: 10, search: 'carta' });

    expect(result.items.map((item) => item.id)).toEqual(['escribir-carta']);
  });

  it('pagina los resultados', async () => {
    const useCase = new ListGuidesUseCase(buildRepository());

    const result = await useCase.execute({ page: 2, limit: 2 });

    expect(result.total).toBe(3);
    expect(result.page).toBe(2);
    expect(result.items).toHaveLength(1);
  });

  it('devuelve el resumen con el total de pasos calculado', async () => {
    const useCase = new ListGuidesUseCase(buildRepository());

    const result = await useCase.execute({ page: 1, limit: 10, categoryId: 'documentos' });

    expect(result.items[0]).toMatchObject({
      id: 'escribir-carta',
      categoryId: 'documentos',
      totalSteps: 1,
      estimatedMinutes: 3,
      isMostRequested: false,
      tag: null,
    });
  });
});