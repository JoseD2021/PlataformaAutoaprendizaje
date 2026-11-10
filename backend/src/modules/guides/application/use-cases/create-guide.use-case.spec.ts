import { Permission } from '../../../users/domain/enums/permission.enum';
import { GuideStatus } from '../../domain/enums/guide-status.enum';
import { CannotManageGuideError, InvalidGuideStepError } from '../../domain/errors/guide.errors';
import { GuideAlreadyExistsError, GuideCategoryNotFoundError } from '../errors/guide.errors';
import { CreateGuideUseCase } from './create-guide.use-case';
import {
  FakeCategoryLookup,
  InMemoryGuideRepository,
  makeGuide,
} from '../../../../../test/support/fakes';

const actor = { permissions: [Permission.GUIDES_CREATE] };

const input = {
  title: 'Enviar un correo con una foto',
  categoryId: 'cat-correo',
  estimatedMinutes: 3,
  steps: [
    { shortTitle: 'Redactar', action: 'Haz clic en Redactar', description: 'Arriba a la izquierda.' },
    { shortTitle: 'Enviar', action: 'Haz clic en Enviar', description: 'Botón azul.' },
  ],
};

const build = (guides = new InMemoryGuideRepository()) => ({
  guides,
  useCase: new CreateGuideUseCase(guides, new FakeCategoryLookup({ correo: 'cat-correo' })),
});

describe('CreateGuideUseCase', () => {
  it('crea una guía en borrador con el id derivado del título', async () => {
    const { guides, useCase } = build();

    const result = await useCase.execute(input, actor);

    expect(result.id).toBe('enviar-un-correo-con-una-foto');
    expect(result.status).toBe(GuideStatus.DRAFT);
    expect(result.totalSteps).toBe(2);
    expect(result.steps.map((step) => step.position)).toEqual([1, 2]);
    expect(guides.all).toHaveLength(1);
  });

  it('genera el id sin tildes', async () => {
    const { useCase } = build();

    const result = await useCase.execute({ ...input, title: 'Cómo usar la cámara' }, actor);

    expect(result.id).toBe('como-usar-la-camara');
  });

  it('rechaza al actor sin permiso', async () => {
    const { guides, useCase } = build();

    await expect(useCase.execute(input, { permissions: [] })).rejects.toBeInstanceOf(
      CannotManageGuideError,
    );
    expect(guides.all).toHaveLength(0);
  });

  it('rechaza una categoría que no existe', async () => {
    const { guides, useCase } = build();

    await expect(
      useCase.execute({ ...input, categoryId: 'cat-inexistente' }, actor),
    ).rejects.toBeInstanceOf(GuideCategoryNotFoundError);
    expect(guides.all).toHaveLength(0);
  });

  it('rechaza un título que genera un id ya existente', async () => {
    const { useCase } = build(
      new InMemoryGuideRepository([makeGuide({ id: 'enviar-un-correo-con-una-foto' })]),
    );

    await expect(useCase.execute(input, actor)).rejects.toBeInstanceOf(GuideAlreadyExistsError);
  });

  it('no guarda nada si un paso es inválido', async () => {
    const { guides, useCase } = build();

    await expect(
      useCase.execute(
        { ...input, steps: [{ shortTitle: 'Redactar', action: '   ', description: 'Texto.' }] },
        actor,
      ),
    ).rejects.toBeInstanceOf(InvalidGuideStepError);
    expect(guides.all).toHaveLength(0);
  });

  it('genera las palabras clave desde el título y conserva las del personal', async () => {
    const { useCase } = build();

    const result = await useCase.execute(
      { ...input, title: 'Enviar archivos por correo', keywords: 'cartulina' },
      actor,
    );
    const words = result.searchKeywords.split(' ');

    expect(words).toEqual(expect.arrayContaining(['cartulina', 'mandar', 'email']));
  });
});