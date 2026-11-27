import { Permission } from '../../../users/domain/enums/permission.enum';
import { Doubt } from '../../domain/entities/doubt.entity';
import { InMemoryDoubtRepository } from '../../../../../test/support/doubt-fakes';
import { DoubtNotFoundError } from '../errors/doubt.errors';
import { DeleteDoubtUseCase } from './delete-doubt.use-case';

const CATEGORY_ID = '11111111-1111-4111-8111-111111111111';
const actor = { permissions: [Permission.DOUBTS_MANAGE] };

function duda(id: string): Doubt {
  const fecha = new Date('2026-11-26T12:00:00.000Z');
  return Doubt.rehydrate({
    id,
    question: '¿Cómo envío una foto?',
    normalizedQuestion: '¿cómo envío una foto?',
    categoryId: CATEGORY_ID,
    topic: 'Correo',
    times: 3,
    createdAt: fecha,
    lastAskedAt: fecha,
  });
}

describe('DeleteDoubtUseCase', () => {
  it('elimina la duda indicada y deja las demás', async () => {
    const dudas = new InMemoryDoubtRepository([duda('a'), duda('b')]);
    const useCase = new DeleteDoubtUseCase(dudas);

    await useCase.execute('a', actor);

    expect(dudas.all.map((duda) => duda.id)).toEqual(['b']);
  });

  it('avisa si la duda ya no existe', async () => {
    const useCase = new DeleteDoubtUseCase(new InMemoryDoubtRepository());

    await expect(useCase.execute('inexistente', actor)).rejects.toThrow(DoubtNotFoundError);
  });

  it('rechaza a quien no tiene el permiso', async () => {
    const dudas = new InMemoryDoubtRepository([duda('a')]);
    const useCase = new DeleteDoubtUseCase(dudas);

    await expect(useCase.execute('a', { permissions: [] })).rejects.toThrow(
      'No tienes permiso para eliminar dudas.',
    );
    expect(dudas.all).toHaveLength(1);
  });
});
