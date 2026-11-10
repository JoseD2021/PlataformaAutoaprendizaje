import { GuideStatus } from '../../domain/enums/guide-status.enum';

export const ESTADOS_GUIA = ['borrador', 'publicada'] as const;
export type EstadoGuia = (typeof ESTADOS_GUIA)[number];

export function estadoDesdeStatus(status: GuideStatus): EstadoGuia {
  return status === GuideStatus.PUBLISHED ? 'publicada' : 'borrador';
}

export function statusDesdeEstado(estado: EstadoGuia): GuideStatus {
  return estado === 'publicada' ? GuideStatus.PUBLISHED : GuideStatus.DRAFT;
}