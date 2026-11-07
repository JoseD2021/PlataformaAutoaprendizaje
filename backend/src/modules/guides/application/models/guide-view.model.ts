import type { Guide } from '../../domain/entities/guide.entity';
import type { GuideStep } from '../../domain/entities/guide-step.entity';

/** Lo que muestra la lista de guías (equivale a GuiaResumen del front). */
export interface GuideSummaryModel {
  id: string;
  title: string;
  categoryId: string;
  totalSteps: number;
  estimatedMinutes: number;
  isMostRequested: boolean;
  tag: string | null;
}

/** Un paso dentro del detalle de la guía. */
export interface GuideStepModel {
  position: number;
  shortTitle: string;
  action: string;
  description: string;
  imageUrl: string | null;
  imageCaption: string | null;
}

/** Lo que muestra la pantalla paso a paso: el resumen más sus pasos. */
export interface GuideDetailModel extends GuideSummaryModel {
  steps: GuideStepModel[];
}

export function toGuideSummaryModel(guide: Guide): GuideSummaryModel {
  return {
    id: guide.id,
    title: guide.title,
    categoryId: guide.categoryId,
    totalSteps: guide.totalSteps,
    estimatedMinutes: guide.estimatedMinutes,
    isMostRequested: guide.isMostRequested,
    tag: guide.tag,
  };
}

function toGuideStepModel(step: GuideStep): GuideStepModel {
  return {
    position: step.position,
    shortTitle: step.shortTitle,
    action: step.action,
    description: step.description,
    imageUrl: step.imageUrl,
    imageCaption: step.imageCaption,
  };
}

export function toGuideDetailModel(guide: Guide): GuideDetailModel {
  return {
    ...toGuideSummaryModel(guide),
    steps: guide.steps.map(toGuideStepModel),
  };
}