import type { Doubt } from '../entities/doubt.entity';

export abstract class DoubtRepository {
  /** Duda ya registrada con la misma pregunta (normalizada) y tema. */
  abstract findByQuestionAndCategory(
    normalizedQuestion: string,
    categoryId: string,
  ): Promise<Doubt | null>;
  abstract findById(id: string): Promise<Doubt | null>;
  /** Todas las dudas, con las más preguntadas primero. */
  abstract findAll(): Promise<Doubt[]>;
  abstract save(doubt: Doubt): Promise<void>;
  abstract delete(id: string): Promise<void>;
}

export const DOUBT_REPOSITORY = Symbol('DOUBT_REPOSITORY');
