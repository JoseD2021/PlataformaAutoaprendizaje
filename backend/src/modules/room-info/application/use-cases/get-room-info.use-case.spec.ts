import { GetRoomInfoUseCase } from './get-room-info.use-case';
import {
  InMemoryRoomInfoRepository,
  makeRoomRule,
  makeScheduleEntry,
} from '../../../../../test/support/fakes';

describe('GetRoomInfoUseCase', () => {
  it('devuelve horarios y normas en el orden de visualización', async () => {
    const repository = new InMemoryRoomInfoRepository({
      schedules: [
        makeScheduleEntry({ id: 'h2', days: 'Sábado', hours: '9:00 a.m. a 12:00 m.', order: 2 }),
        makeScheduleEntry({ id: 'h1', days: 'Lunes a viernes', hours: '8:00 a.m. a 5:00 p.m.', order: 1 }),
      ],
      rules: [
        makeRoomRule({ id: 'r2', text: 'Cierra tu sesión al terminar.', order: 2 }),
        makeRoomRule({ id: 'r1', text: 'Pide ayuda a un monitor si te pierdes.', order: 1 }),
      ],
    });
    const useCase = new GetRoomInfoUseCase(repository);

    const result = await useCase.execute();

    expect(result.schedules).toEqual([
      { days: 'Lunes a viernes', hours: '8:00 a.m. a 5:00 p.m.' },
      { days: 'Sábado', hours: '9:00 a.m. a 12:00 m.' },
    ]);
    expect(result.rules).toEqual([
      'Pide ayuda a un monitor si te pierdes.',
      'Cierra tu sesión al terminar.',
    ]);
  });

  it('devuelve listas vacías si no hay datos', async () => {
    const useCase = new GetRoomInfoUseCase(new InMemoryRoomInfoRepository());

    await expect(useCase.execute()).resolves.toEqual({ schedules: [], rules: [] });
  });
});