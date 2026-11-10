import { randomUUID } from 'node:crypto';
import { GuideStep } from '../../domain/entities/guide-step.entity';

export interface GuideStepInput {
  shortTitle: string;
  action: string;
  description: string;
  imageUrl?: string | null;
  imageCaption?: string | null;
}

export interface GuideInput {
  title: string;
  categoryId: string;
  estimatedMinutes: number;
  isMostRequested?: boolean;
  tag?: string | null;
  steps: GuideStepInput[];
  keywords?: string;
}

export function buildGuideSteps(steps: GuideStepInput[]): GuideStep[] {
  return steps.map((step, index) =>
    GuideStep.create({ id: randomUUID(), position: index + 1, ...step }),
  );
}