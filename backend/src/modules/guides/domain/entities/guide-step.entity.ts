import { InvalidGuideStepError } from '../errors/guide.errors';

export interface GuideStepProps {
  id: string;
  position: number;
  shortTitle: string;
  action: string;
  description: string;
  imageUrl?: string | null;
  imageCaption?: string | null;
}

export class GuideStep {
  static readonly SHORT_TITLE_MAX_LENGTH = 20;

  readonly id: string;
  readonly position: number;
  readonly shortTitle: string;
  readonly action: string;
  readonly description: string;
  readonly imageUrl: string | null;
  readonly imageCaption: string | null;

  private constructor(props: GuideStepProps) {
    this.id = props.id;
    this.position = props.position;
    this.shortTitle = props.shortTitle;
    this.action = props.action;
    this.description = props.description;
    this.imageUrl = props.imageUrl ?? null;
    this.imageCaption = props.imageCaption ?? null;
  }

  static create(props: GuideStepProps): GuideStep {
    const shortTitle = props.shortTitle?.trim() ?? '';
    const action = props.action?.trim() ?? '';
    const description = props.description?.trim() ?? '';
    const imageUrl = props.imageUrl?.trim() || null;
    const imageCaption = props.imageCaption?.trim() || null;

    if (!Number.isInteger(props.position) || props.position < 1) {
      throw new InvalidGuideStepError('La posición del paso debe ser un entero mayor o igual a 1');
    }
    if (!shortTitle) {
      throw new InvalidGuideStepError('El título corto del paso es obligatorio');
    }
    if (shortTitle.length > GuideStep.SHORT_TITLE_MAX_LENGTH) {
      throw new InvalidGuideStepError(
        `El título corto no puede superar ${GuideStep.SHORT_TITLE_MAX_LENGTH} caracteres`,
      );
    }
    if (!action) {
      throw new InvalidGuideStepError('La acción del paso es obligatoria');
    }
    if (!description) {
      throw new InvalidGuideStepError('La descripción del paso es obligatoria');
    }
    if (imageCaption && !imageUrl) {
      throw new InvalidGuideStepError('El pie de imagen requiere una imagen');
    }

    return new GuideStep({
      ...props,
      shortTitle,
      action,
      description,
      imageUrl,
      imageCaption,
    });
  }
}