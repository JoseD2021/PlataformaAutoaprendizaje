import type { AxiosInstance } from 'axios'
import type { AyudaRepository } from '../domain/ayuda-repository'
import type { NuevaSolicitudAyuda, SolicitudAyuda } from '../domain/entities'
import { httpClient } from '../../../shared/http/client'

interface SolicitudAyudaBackendDto {
  id: string
  puesto: number | null
  guiaId: string | null
  guiaTitulo: string | null
  paso: number | null
  solicitante: string | null
  estado: string
  creadaEn: string
}

function aSolicitud(dto: SolicitudAyudaBackendDto): SolicitudAyuda {
  return {
    id: dto.id,
    puesto: dto.puesto,
    guiaId: dto.guiaId,
    guiaTitulo: dto.guiaTitulo,
    paso: dto.paso,
    solicitante: dto.solicitante,
    creadaEn: dto.creadaEn,
  }
}

export class AyudaHttpRepository implements AyudaRepository {
  private readonly http: AxiosInstance

  constructor(http: AxiosInstance = httpClient) {
    this.http = http
  }

  async pedir(solicitud: NuevaSolicitudAyuda): Promise<SolicitudAyuda> {
    const { data } = await this.http.post<SolicitudAyudaBackendDto>('/help-requests', solicitud)
    return aSolicitud(data)
  }

  async listarPendientes(): Promise<SolicitudAyuda[]> {
    const { data } = await this.http.get<SolicitudAyudaBackendDto[]>('/help-requests/pending')
    return data.map(aSolicitud)
  }

  async marcarAtendida(id: string): Promise<void> {
    await this.http.patch(`/help-requests/${encodeURIComponent(id)}/resolve`)
  }
}
