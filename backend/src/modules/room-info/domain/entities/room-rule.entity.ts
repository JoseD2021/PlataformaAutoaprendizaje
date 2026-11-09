import { InvalidRoomInfoError } from '../errors/room-info.errors';

export interface RoomRuleProps {
  id: string;
  text: string;
  order: number;
}

export class RoomRule {
  static readonly TEXT_MAX_LENGTH = 300;

  readonly id: string;
  readonly text: string;
  readonly order: number;

  private constructor(props: RoomRuleProps) {
    this.id = props.id;
    this.text = props.text;
    this.order = props.order;
  }

  static create(props: RoomRuleProps): RoomRule {
    const text = props.text?.trim() ?? '';

    if (!text) {
      throw new InvalidRoomInfoError('El texto de la norma es obligatorio');
    }
    if (text.length > RoomRule.TEXT_MAX_LENGTH) {
      throw new InvalidRoomInfoError(
        `La norma no puede superar ${RoomRule.TEXT_MAX_LENGTH} caracteres`,
      );
    }
    if (!Number.isInteger(props.order) || props.order < 1) {
      throw new InvalidRoomInfoError('El orden de la norma debe ser un entero mayor o igual a 1');
    }

    return new RoomRule({ ...props, text });
  }
}