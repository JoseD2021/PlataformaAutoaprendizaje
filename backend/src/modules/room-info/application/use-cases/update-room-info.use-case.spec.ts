import { Permission } from '../../../users/domain/enums/permission.enum';
import {
  CannotManageRoomInfoError,
  InvalidRoomInfoError,
} from '../../domain/errors/room-info.errors';
import { MAX_ROOM_RULES, MAX_ROOM_SCHEDULES } from '../../domain/room-info.limits';
import { UpdateRoomInfoUseCase } from './update-room-info.use-case';
import {
  InMemoryRoomInfoRepository,
  makeRoomRule,
  makeScheduleEntry,
} from '../../../../../test/support/fakes';

const actor = { permissions: [Permission.ROOM_INFO_MANAGE] };

const buildRepository = () =>
  new InMemoryRoomInfoRepository({
    schedules: [makeScheduleEntry({ id: 'old-h', days: 'Antiguo', hours: '1:00 p.m.', order: 1 })],
    rules: [makeRoomRule({ id: 'old-r', text: 'Norma antigua.', order: 1 })],
  });

describe('UpdateRoomInfoUseCase', () => {
  it('reemplaza horarios y normas usando el orden del arreglo como posición', async () => {
    const repository = buildRepository();
    const useCase = new UpdateRoomInfoUseCase(repository);

    const result = await useCase.execute(
      {
        schedules: [
          { days: 'Lunes a viernes', hours: '8:00 a.m. a 5:00 p.m.' },
          { days: 'Sábado', hours: '9:00 a.m. a 12:00 m.' },
        ],
        rules: ['Pide ayuda a un monitor.', 'Mantén el volumen bajo.'],
      },
      actor,
    );

    expect(result).toEqual({
      schedules: [
        { days: 'Lunes a viernes', hours: '8:00 a.m. a 5:00 p.m.' },
        { days: 'Sábado', hours: '9:00 a.m. a 12:00 m.' },
      ],
      rules: ['Pide ayuda a un monitor.', 'Mantén el volumen bajo.'],
    });
    expect((await repository.findSchedules()).map((entry) => entry.order)).toEqual([1, 2]);
    expect((await repository.findRules()).map((rule) => rule.text)).toEqual([
      'Pide ayuda a un monitor.',
      'Mantén el volumen bajo.',
    ]);
  });

  it('permite dejar las listas vacías', async () => {
    const repository = buildRepository();
    const useCase = new UpdateRoomInfoUseCase(repository);

    await expect(useCase.execute({ schedules: [], rules: [] }, actor)).resolves.toEqual({
      schedules: [],
      rules: [],
    });
    expect(await repository.countSchedules()).toBe(0);
    expect(await repository.countRules()).toBe(0);
  });

  it('rechaza al actor sin permiso y no cambia nada', async () => {
    const repository = buildRepository();
    const useCase = new UpdateRoomInfoUseCase(repository);

    await expect(
      useCase.execute({ schedules: [], rules: [] }, { permissions: [Permission.USERS_READ] }),
    ).rejects.toBeInstanceOf(CannotManageRoomInfoError);

    expect(await repository.countSchedules()).toBe(1);
    expect(await repository.countRules()).toBe(1);
  });

  it('no guarda nada si un horario es inválido', async () => {
    const repository = buildRepository();
    const useCase = new UpdateRoomInfoUseCase(repository);

    await expect(
      useCase.execute(
        {
          schedules: [
            { days: 'Sábado', hours: '9:00 a.m. a 12:00 m.' },
            { days: '   ', hours: 'Cerrado' },
          ],
          rules: ['Norma válida.'],
        },
        actor,
      ),
    ).rejects.toBeInstanceOf(InvalidRoomInfoError);

    expect((await repository.findSchedules())[0].days).toBe('Antiguo');
    expect((await repository.findRules())[0].text).toBe('Norma antigua.');
  });

  it('no guarda nada si una norma es inválida', async () => {
    const repository = buildRepository();
    const useCase = new UpdateRoomInfoUseCase(repository);

    await expect(
      useCase.execute(
        { schedules: [{ days: 'Sábado', hours: '9:00 a.m.' }], rules: ['Válida.', ''] },
        actor,
      ),
    ).rejects.toBeInstanceOf(InvalidRoomInfoError);

    expect((await repository.findSchedules())[0].days).toBe('Antiguo');
  });

  it('rechaza más horarios o normas que el límite', async () => {
    const useCase = new UpdateRoomInfoUseCase(buildRepository());
    const schedules = Array.from({ length: MAX_ROOM_SCHEDULES + 1 }, (_, i) => ({
      days: `Día ${i}`,
      hours: '8:00 a.m.',
    }));
    const rules = Array.from({ length: MAX_ROOM_RULES + 1 }, (_, i) => `Norma ${i}`);

    await expect(useCase.execute({ schedules, rules: [] }, actor)).rejects.toBeInstanceOf(
      InvalidRoomInfoError,
    );
    await expect(useCase.execute({ schedules: [], rules }, actor)).rejects.toBeInstanceOf(
      InvalidRoomInfoError,
    );
  });
});