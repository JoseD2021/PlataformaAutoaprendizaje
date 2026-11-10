import { GuideStatus } from '../enums/guide-status.enum';
import { InvalidGuideError } from '../errors/guide.errors';
import { GuideStep } from './guide-step.entity';

export interface GuideProps {
  id: string;
  title: string;
  categoryId: string;
  estimatedMinutes: number;
  isMostRequested?: boolean;
  tag?: string | null;
  status?: GuideStatus;
  steps?: GuideStep[];
  createdAt?: Date;
  updatedAt?: Date;
  searchKeywords?: string;
}

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export class Guide {
  readonly id: string;
  readonly title: string;
  readonly categoryId: string;
  readonly estimatedMinutes: number;
  readonly isMostRequested: boolean;
  readonly tag: string | null;
  readonly steps: readonly GuideStep[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly searchKeywords: string;
  private _status: GuideStatus;

  private constructor(props: Required<Omit<GuideProps, 'tag'>> & { tag: string | null }) {
    this.id = props.id;
    this.title = props.title;
    this.categoryId = props.categoryId;
    this.estimatedMinutes = props.estimatedMinutes;
    this.isMostRequested = props.isMostRequested;
    this.tag = props.tag;
    this._status = props.status;
    this.steps = props.steps;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.searchKeywords = props.searchKeywords;
  }

  get status(): GuideStatus {
    return this._status;
  }

  get totalSteps(): number {
    return this.steps.length;
  }

  static create(props: GuideProps): Guide {
    const id = props.id?.trim() ?? '';
    const title = props.title?.trim() ?? '';
    const categoryId = props.categoryId?.trim() ?? '';
    const tag = props.tag?.trim() || null;
    const steps = [...(props.steps ?? [])].sort((a, b) => a.position - b.position);
    const status = props.status ?? GuideStatus.DRAFT;

    if (!SLUG_PATTERN.test(id)) {
      throw new InvalidGuideError(
        'El id de la guía solo admite minúsculas, números y guiones (ej: entrar-correo)',
      );
    }
    if (!title) {
      throw new InvalidGuideError('El título de la guía es obligatorio');
    }
    if (!categoryId) {
      throw new InvalidGuideError('La guía debe pertenecer a una categoría');
    }
    if (!Number.isInteger(props.estimatedMinutes) || props.estimatedMinutes < 1) {
      throw new InvalidGuideError('Los minutos estimados deben ser un entero mayor a 0');
    }
    steps.forEach((step, index) => {
      if (step.position !== index + 1) {
        throw new InvalidGuideError(
          'Las posiciones de los pasos deben ser consecutivas empezando en 1',
        );
      }
    });
    if (status === GuideStatus.PUBLISHED && steps.length === 0) {
      throw new InvalidGuideError('Una guía publicada debe tener al menos un paso');
    }

    const now = new Date();
    return new Guide({
      id,
      title,
      categoryId,
      estimatedMinutes: props.estimatedMinutes,
      isMostRequested: props.isMostRequested ?? false,
      tag,
      status,
      steps,
      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
      searchKeywords: props.searchKeywords ?? ''
    });
  }

  publish(): void {
    if (this.steps.length === 0) {
      throw new InvalidGuideError('No se puede publicar una guía sin pasos');
    }
    this._status = GuideStatus.PUBLISHED;
  }

  unpublish(): void {
    this._status = GuideStatus.DRAFT;
  }
}