import { InvalidRoomInfoError } from '../errors/room-info.errors';
import { makeRoomRule, makeScheduleEntry } from '../../../../../test/support/fakes';

describe('ScheduleEntry', () => {
  it('recorta los espacios de días y horas', () => {
    const entry = makeScheduleEntry({ days: '  Sábado ', hours: ' 9:00 a.m. a 12:00 m. ' });

    expect(entry.days).toBe('Sábado');
    expect(entry.hours).toBe('9:00 a.m. a 12:00 m.');
  });

  it.each([
    ['días vacíos', { days: '   ' }],
    ['horas vacías', { hours: '' }],
    ['texto demasiado largo', { days: 'x'.repeat(81) }],
    ['orden en cero', { order: 0 }],
    ['orden decimal', { order: 1.5 }],
  ])('rechaza %s', (_name, overrides) => {
    expect(() => makeScheduleEntry(overrides)).toThrow(InvalidRoomInfoError);
  });
});

describe('RoomRule', () => {
  it('recorta el texto de la norma', () => {
    expect(makeRoomRule({ text: '  Mantén el volumen bajo.  ' }).text).toBe(
      'Mantén el volumen bajo.',
    );
  });

  it.each([
    ['texto vacío', { text: '  ' }],
    ['texto demasiado largo', { text: 'x'.repeat(301) }],
    ['orden en cero', { order: 0 }],
  ])('rechaza %s', (_name, overrides) => {
    expect(() => makeRoomRule(overrides)).toThrow(InvalidRoomInfoError);
  });
});