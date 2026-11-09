import { InvalidRoomInfoError } from '../errors/room-info.errors';

export interface ScheduleEntryProps {
  id: string;
  days: string;
  hours: string;
  order: number;
}

export class ScheduleEntry {
  static readonly TEXT_MAX_LENGTH = 80;

  readonly id: string;
  readonly days: string;
  readonly hours: string;
  readonly order: number;

  private constructor(props: ScheduleEntryProps) {
    this.id = props.id;
    this.days = props.days;
    this.hours = props.hours;
    this.order = props.order;
  }

  static create(props: ScheduleEntryProps): ScheduleEntry {
    const days = props.days?.trim() ?? '';
    const hours = props.hours?.trim() ?? '';

    if (!days) {
      throw new InvalidRoomInfoError('Los días del horario son obligatorios');
    }
    if (!hours) {
      throw new InvalidRoomInfoError('Las horas del horario son obligatorias');
    }
    if (days.length > ScheduleEntry.TEXT_MAX_LENGTH || hours.length > ScheduleEntry.TEXT_MAX_LENGTH) {
      throw new InvalidRoomInfoError(
        `Los días y las horas no pueden superar ${ScheduleEntry.TEXT_MAX_LENGTH} caracteres`,
      );
    }
    if (!Number.isInteger(props.order) || props.order < 1) {
      throw new InvalidRoomInfoError('El orden del horario debe ser un entero mayor o igual a 1');
    }

    return new ScheduleEntry({ ...props, days, hours });
  }
}