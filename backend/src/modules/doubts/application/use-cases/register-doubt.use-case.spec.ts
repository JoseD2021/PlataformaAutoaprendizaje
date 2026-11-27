import { Category } from '../../../categories/domain/entities/category.entity';
import { Permission } from '../../../users/domain/enums/permission.enum';
import {
  InMemoryDoubtCategoryRepository,
  InMemoryDoubtRepository,
} from '../../../../../test/support/doubt-fakes';
import { InvalidDoubtError } from '../../domain/errors/doubt.errors';
import { DoubtCategoryNotFoundError } from '../errors/doubt.errors';
import { RegisterDoubtUseCase } from './register-doubt.use-case';

const CATEGORY_ID = '11111111-1111-4111-8111-111111111111';
const actor = { permissions: [Permission.DOUBTS_MANAGE] };

function setup() {
  const doubts = new InMemoryDoubtRepository();
  const categories = new InMemoryDoubtCategoryRepository([
    Category.create({ id: CATEGORY_ID, name: 'Correo', slug: 'correo' }),
  ]);

  return { doubts, useCase: new RegisterDoubtUseCase(doubts, categories) };
}

describe('RegisterDoubtUseCase', () => {
  it('anota una duda nueva con el nombre de la categoría como tema', async () => {
    const { doubts, useCase } = setup();

    const result = await useCase.execute(
      { question: '¿Cómo envío una foto?', categoryId: CATEGORY_ID },
      actor,
    );

    expect(result.question).toBe('¿Cómo envío una foto?');
    expect(result.topic).toBe('Correo');
    expect(result.times).toBe(1);
    expect(doubts.all).toHaveLength(1);
  });

  it('suma una vez a la duda existente en lugar de duplicarla', async () => {
    const { doubts, useCase } = setup();
    const primera = await useCase.execute(
      { question: '¿Cómo envío una foto?', categoryId: CATEGORY_ID },
      actor,
    );
    const segunda = await useCase.execute(
      { question: '  ¿cómo   envío una foto?  ', categoryId: CATEGORY_ID },
      actor,
    );

    expect(segunda.id).toBe(primera.id);
    expect(segunda.times).toBe(2);
    expect(segunda.lastAskedAt.getTime()).toBeGreaterThanOrEqual(
      primera.lastAskedAt.getTime(),
    );
    expect(doubts.all).toHaveLength(1);
  });

  it('crea una duda distinta si el tema es otro', async () => {
    const { doubts, useCase } = setup();
    const otraCategoria = Category.create({
      id: '22222222-2222-4222-8222-222222222222',
      name: 'Seguridad',
      slug: 'seguridad',
    });
    const categoriaRepo = new InMemoryDoubtCategoryRepository([otraCategoria]);
    const useCaseOtraCategoria = new RegisterDoubtUseCase(doubts, categoriaRepo);

    await useCase.execute({ question: '¿Cómo envío una foto?', categoryId: CATEGORY_ID }, actor);
    const otra = await useCaseOtraCategoria.execute(
      { question: '¿Cómo envío una foto?', categoryId: otraCategoria.id },
      actor,
    );

    expect(otra.times).toBe(1);
    expect(doubts.all).toHaveLength(2);
  });

  it('rechaza un tema que no existe', async () => {
    const { useCase } = setup();

    await expect(
      useCase.execute(
        {
          question: '¿Cómo envío una foto?',
          categoryId: '33333333-3333-4333-8333-333333333333',
        },
        actor,
      ),
    ).rejects.toThrow(DoubtCategoryNotFoundError);
  });

  it('rechaza una duda demasiado corta', async () => {
    const { useCase } = setup();

    await expect(
      useCase.execute({ question: '   ', categoryId: CATEGORY_ID }, actor),
    ).rejects.toThrow(InvalidDoubtError);
  });

  it('rechaza a quien no tiene el permiso', async () => {
    const { doubts, useCase } = setup();

    await expect(
      useCase.execute(
        { question: '¿Cómo envío una foto?', categoryId: CATEGORY_ID },
        { permissions: [] },
      ),
    ).rejects.toThrow('No tienes permiso para anotar dudas.');
    expect(doubts.all).toHaveLength(0);
  });
});
