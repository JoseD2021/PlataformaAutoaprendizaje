import { HelpRequestStatus } from '../enums/help-request-status.enum';
import { InvalidHelpRequestError } from '../errors/help-request.errors';

export const MAX_STATION_NUMBER = 999;

export interface HelpRequestProps {
  id: string;
  stationNumber: number | null;
  guideId: string | null;
  guideTitle: string | null;
  stepNumber: number | null;
  userId: string | null;
  requesterName: string | null;
  status: HelpRequestStatus;
  createdAt: Date;
  resolvedAt: Date | null;
  resolvedBy: string | null;
}

export interface CreateHelpRequestProps {
  id: string;
  stationNumber?: number | null;
  guideId?: string | null;
  guideTitle?: string | null;
  stepNumber?: number | null;
  userId?: string | null;
  requesterName?: string | null;
  now?: Date;
}

/**
 * Aviso de que alguien en la sala necesita que la asistente vaya a su puesto.
 * El puesto, la guía y el usuario son opcionales: la sala es pequeña y se puede
 * pedir ayuda sin cuenta.
 */
export class HelpRequest {
  private constructor(private props: HelpRequestProps) {}

  static create(props: CreateHelpRequestProps): HelpRequest {
    const stationNumber = props.stationNumber ?? null;
    const stepNumber = props.stepNumber ?? null;
    const guideId = props.guideId ?? null;

    if (
      stationNumber !== null &&
      (!Number.isInteger(stationNumber) || stationNumber < 1 || stationNumber > MAX_STATION_NUMBER)
    ) {
      throw new InvalidHelpRequestError(
        `El número de puesto debe ser un entero entre 1 y ${MAX_STATION_NUMBER}.`,
      );
    }

    if (stepNumber !== null && (!Number.isInteger(stepNumber) || stepNumber < 1)) {
      throw new InvalidHelpRequestError('El número de paso debe ser un entero mayor que 0.');
    }

    if (stepNumber !== null && guideId === null) {
      throw new InvalidHelpRequestError('Para indicar un paso hay que indicar también la guía.');
    }

    return new HelpRequest({
      id: props.id,
      stationNumber,
      guideId,
      guideTitle: guideId ? (props.guideTitle ?? null) : null,
      stepNumber,
      userId: props.userId ?? null,
      requesterName: props.requesterName ?? null,
      status: HelpRequestStatus.PENDING,
      createdAt: props.now ?? new Date(),
      resolvedAt: null,
      resolvedBy: null,
    });
  }

  static rehydrate(props: HelpRequestProps): HelpRequest {
    return new HelpRequest({ ...props });
  }

  /** Marca la solicitud como atendida. Si ya lo estaba, no cambia nada. */
  resolve(resolvedBy: string, now: Date = new Date()): void {
    if (this.props.status === HelpRequestStatus.RESOLVED) {
      return;
    }

    this.props.status = HelpRequestStatus.RESOLVED;
    this.props.resolvedAt = now;
    this.props.resolvedBy = resolvedBy;
  }

  get id(): string {
    return this.props.id;
  }

  get stationNumber(): number | null {
    return this.props.stationNumber;
  }

  get guideId(): string | null {
    return this.props.guideId;
  }

  get guideTitle(): string | null {
    return this.props.guideTitle;
  }

  get stepNumber(): number | null {
    return this.props.stepNumber;
  }

  get userId(): string | null {
    return this.props.userId;
  }

  get requesterName(): string | null {
    return this.props.requesterName;
  }

  get status(): HelpRequestStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get resolvedAt(): Date | null {
    return this.props.resolvedAt;
  }

  get resolvedBy(): string | null {
    return this.props.resolvedBy;
  }
}
