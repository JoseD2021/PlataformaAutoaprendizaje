import type { NuevaSolicitudAyuda, SolicitudAyuda } from './entities'

export interface AyudaRepository {
  pedir(solicitud: NuevaSolicitudAyuda): Promise<SolicitudAyuda>
  listarPendientes(): Promise<SolicitudAyuda[]>
  marcarAtendida(id: string): Promise<void>
}
