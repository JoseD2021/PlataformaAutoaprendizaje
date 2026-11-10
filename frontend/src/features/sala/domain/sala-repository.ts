import type { InformacionSala } from './entities'

export interface SalaRepository {
  obtenerInformacion(): Promise<InformacionSala>
}