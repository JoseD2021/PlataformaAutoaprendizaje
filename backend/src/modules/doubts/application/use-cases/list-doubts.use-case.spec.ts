import { Permission } from '../../../users/domain/enums/permission.enum';
import { Doubt } from '../../domain/entities/doubt.entity';
import { InMemoryDoubtRepository } from '../../../../../test/support/doubt-fakes';
import { ListDoubtsUseCase } from './list-doubts.use-case';

const CATEGORY_ID = '11111111-1111-4111-8111-111111111111';

function duda(id: string, question: string, times: number, dia: number) {
  const fecha = new Date(Date.UTC(2026, 10, dia, 12));
  return Doubt.rehydrate({
    id,
    question,
    normalizedQuestion: question.toLowerCase(),
    categoryId: CATEGORY_ID,
    topic: 'Correo',
    times,
    createdAt: fecha,
    lastAskedAt: fecha,
  });
}

describe('ListDoubtsUseCase', () => {
  it('devuelve primero las más preguntadas y luego las más recientes', async () => {
    const dudas = new InMemoryDoubtRepository([
      duda('a', 'Poco preguntada', 1, 2),
      duda('b', 'Muy preguntada', 7, 3),
      duda('c', 'Reciente', 1, 25),
    ]);
    const useCase = new ListDoubtsUseCase(dudas);

    const result = await useCase.execute({
      permissions: [Permission.DOUBTS_MANAGE],
    });

    expect(result.map((duda) => duda.question)).toEqual([
      'Muy preguntada',
      'Reciente',
      'Poco preguntada',
    ]);
  });

  it('rechaza a quien no tiene el permiso', async () => {
    const useCase = new ListDoubtsUseCase(new InMemoryDoubtRepository());

    await expect(useCase.execute({ permissions: [] })).rejects.toThrow(
      'No tienes permiso para consultar las dudas.',
    );
  });
});
