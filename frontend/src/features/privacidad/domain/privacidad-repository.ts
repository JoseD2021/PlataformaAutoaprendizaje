import type { TerminosPrivacidad } from './entities'

export interface PrivacidadRepository {
  obtenerTerminos(): Promise<TerminosPrivacidad>
  actualizarTerminos(datos: TerminosPrivacidad): Promise<TerminosPrivacidad>
}
