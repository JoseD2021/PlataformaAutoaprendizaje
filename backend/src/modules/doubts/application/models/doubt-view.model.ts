import type { Doubt } from '../../domain/entities/doubt.entity';

export interface DoubtModel {
  id: string;
  question: string;
  topic: string;
  times: number;
  createdAt: Date;
  lastAskedAt: Date;
}

export function toDoubtModel(doubt: Doubt): DoubtModel {
  return {
    id: doubt.id,
    question: doubt.question,
    topic: doubt.topic,
    times: doubt.times,
    createdAt: doubt.createdAt,
    lastAskedAt: doubt.lastAskedAt,
  };
}
