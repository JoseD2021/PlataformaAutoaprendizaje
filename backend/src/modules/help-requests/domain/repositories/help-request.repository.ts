import type { HelpRequest } from '../entities/help-request.entity';

export abstract class HelpRequestRepository {
  abstract save(helpRequest: HelpRequest): Promise<void>;
  abstract findById(id: string): Promise<HelpRequest | null>;
  /** Solicitud pendiente del mismo puesto o del mismo usuario, para no duplicar avisos. */
  abstract findPendingByStationOrUser(
    stationNumber: number | null,
    userId: string | null,
  ): Promise<HelpRequest | null>;
  /** Solicitudes pendientes, de la más antigua a la más reciente. */
  abstract listPending(): Promise<HelpRequest[]>;
}

export const HELP_REQUEST_REPOSITORY = Symbol('HELP_REQUEST_REPOSITORY');
