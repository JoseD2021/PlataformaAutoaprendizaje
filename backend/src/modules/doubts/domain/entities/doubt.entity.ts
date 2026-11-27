import { InvalidDoubtError } from '../errors/doubt.errors';

export const MIN_QUESTION_LENGTH = 3;
export const MAX_QUESTION_LENGTH = 300;

/** Mayúsculas y espacios repetidos se tratan igual para detectar dudas repetidas. */
export function normalizeQuestion(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('es');
}

export interface DoubtProps {
  id: string;
  question: string;
  normalizedQuestion: string;
  categoryId: string;
  topic: string;
  times: number;
  createdAt: Date;
  lastAskedAt: Date;
}

export interface CreateDoubtProps {
  id: string;
  question: string;
  categoryId: string;
  topic: string;
  now?: Date;
}

/**
 * Duda sin guía que el personal ha anotado en la sala.
 * Una duda repetida no crea otra fila: incrementa `times` y su última vez.
 */
export class Doubt {
  private constructor(private props: DoubtProps) {}

  static create(props: CreateDoubtProps): Doubt {
    const question = props.question.trim().replace(/\s+/g, ' ');
    const normalizedQuestion = normalizeQuestion(props.question);
    const categoryId = props.categoryId.trim();
    const topic = props.topic.trim();

    if (normalizedQuestion.length < MIN_QUESTION_LENGTH || normalizedQuestion.length > MAX_QUESTION_LENGTH) {
      throw new InvalidDoubtError(
        `La duda debe tener entre ${MIN_QUESTION_LENGTH} y ${MAX_QUESTION_LENGTH} caracteres.`,
      );
    }

    if (categoryId === '') {
      throw new InvalidDoubtError('La duda debe tener un tema.');
    }

    if (topic === '') {
      throw new InvalidDoubtError('El tema de la duda no puede estar vacío.');
    }

    const now = props.now ?? new Date();

    return new Doubt({
      id: props.id,
      question,
      normalizedQuestion,
      categoryId,
      topic,
      times: 1,
      createdAt: now,
      lastAskedAt: now,
    });
  }

  static rehydrate(props: DoubtProps): Doubt {
    return new Doubt({ ...props });
  }

  /** Registra una repetición de la misma duda. */
  registerAnother(now: Date = new Date()): void {
    this.props.times += 1;
    this.props.lastAskedAt = now;
  }

  get id(): string {
    return this.props.id;
  }

  get question(): string {
    return this.props.question;
  }

  get normalizedQuestion(): string {
    return this.props.normalizedQuestion;
  }

  get categoryId(): string {
    return this.props.categoryId;
  }

  get topic(): string {
    return this.props.topic;
  }

  get times(): number {
    return this.props.times;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get lastAskedAt(): Date {
    return this.props.lastAskedAt;
  }
}
