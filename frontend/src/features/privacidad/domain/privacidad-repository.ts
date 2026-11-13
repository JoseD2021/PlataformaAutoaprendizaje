import type { TerminosPrivacidad } from './entities'

export interface PrivacidadRepository {
  obtenerTerminos(): Promise<TerminosPrivacidad>
}
