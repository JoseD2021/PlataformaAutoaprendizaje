import { Permission } from '../../../users/domain/enums/permission.enum';
import { GuideStatus } from '../../domain/enums/guide-status.enum';
import { CannotManageGuideError, InvalidGuideError } from '../../domain/errors/guide.errors';
import { GuideCategoryNotFoundError, GuideNotFoundError } from '../errors/guide.errors';
import { UpdateGuideUseCase } from './update-guide.use-case';
import {
  FakeCategoryLookup,
  InMemoryGuideRepository,
  makeGuide,
} from '../../../../../test/support/fakes';

const actor = { permissions: [Permission.GUIDES_MANAGE] };

const input = {
  title: 'Enviar fotos por correo',
  categoryId: 'cat-correo',
  estimatedMinutes: 5,
  isMostRequested: true,
  tag: 'Nuevo',
  steps: [
    { shortTitle: 'Abrir', action: 'Abre tu correo', description: 'Entra a Gmail.' },
    { shortTitle: 'Enviar', action: 'Haz clic en Enviar', description: 'Botón azul.' },
  ],
};

const build = () => {
  const existing = makeGuide({
    id: 'enviar-correo-foto',
    categoryId: 'cat-correo',
    status: GuideStatus.PUBLISHED,
  });
  const guides = new InMemoryGuideRepository([existing]);
  const useCase = new UpdateGuideUseCase(guides, new FakeCategoryLookup({ correo: 'cat-correo' }));

  return { existing, guides, useCase };
};

describe('UpdateGuideUseCase', () => {
  it('reemplaza los datos y los pasos conservando id, estado y fecha de creación', async () => {
    const { existing, guides, useCase } = build();

    const result = await useCase.execute('enviar-correo-foto', input, actor);

    expect(result.id).toBe('enviar-correo-foto');
    expect(result.title).toBe('Enviar fotos por correo');
    expect(result.isMostRequested).toBe(true);
    expect(result.tag).toBe('Nuevo');
    expect(result.steps.map((step) => step.shortTitle)).toEqual(['Abrir', 'Enviar']);
    expect(result.status).toBe(GuideStatus.PUBLISHED);

    const saved = await guides.findById('enviar-correo-foto');
    expect(saved?.createdAt).toEqual(existing.createdAt);
  });

  it('rechaza una guía que no existe', async () => {
    const { useCase } = build();

    await expect(useCase.execute('no-existe', input, actor)).rejects.toBeInstanceOf(
      GuideNotFoundError,
    );
  });

  it('rechaza al actor sin permiso', async () => {
    const { useCase } = build();

    await expect(
      useCase.execute('enviar-correo-foto', input, { permissions: [] }),
    ).rejects.toBeInstanceOf(CannotManageGuideError);
  });

  it('rechaza una categoría que no existe', async () => {
    const { useCase } = build();

    await expect(
      useCase.execute('enviar-correo-foto', { ...input, categoryId: 'cat-inexistente' }, actor),
    ).rejects.toBeInstanceOf(GuideCategoryNotFoundError);
  });

  it('no deja una guía publicada sin pasos y conserva lo anterior', async () => {
    const { guides, useCase } = build();

    await expect(
      useCase.execute('enviar-correo-foto', { ...input, steps: [] }, actor),
    ).rejects.toBeInstanceOf(InvalidGuideError);

    expect((await guides.findById('enviar-correo-foto'))?.title).toBe(
      'Enviar un correo con una foto',
    );
  });

  it('conserva las palabras clave manuales si se omiten', async () => {
    const { guides, useCase } = build();
    await guides.save(
      makeGuide({
        id: 'enviar-correo-foto',
        categoryId: 'cat-correo',
        status: GuideStatus.PUBLISHED,
        searchKeywords: 'hoja papel',
      }),
    );

    const result = await useCase.execute('enviar-correo-foto', input, actor);
    const words = result.searchKeywords.split(' ');

    expect(words).toEqual(expect.arrayContaining(['hoja', 'papel']));
  });

  it('reemplaza las palabras manuales cuando se envían nuevas', async () => {
    const { guides, useCase } = build();
    await guides.save(
      makeGuide({
        id: 'enviar-correo-foto',
        categoryId: 'cat-correo',
        status: GuideStatus.PUBLISHED,
        searchKeywords: 'hoja papel',
      }),
    );

    const result = await useCase.execute(
      'enviar-correo-foto',
      { ...input, keywords: 'cartulina' },
      actor,
    );
    const words = result.searchKeywords.split(' ');

    expect(words).toContain('cartulina');
    expect(words).not.toContain('hoja');
  });
});