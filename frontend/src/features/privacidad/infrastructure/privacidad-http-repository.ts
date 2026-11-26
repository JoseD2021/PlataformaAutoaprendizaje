import type { AxiosInstance } from 'axios'
import { httpClient } from '../../../shared/http/client'
import type { TerminosPrivacidad } from '../domain/entities'
import type { PrivacidadRepository } from '../domain/privacidad-repository'

interface SeccionTerminosBackendDto {
  title: string
  paragraphs: string[]
}

interface TerminosBackendDto {
  version: string
  effectiveDate: string
  title: string
  sections: SeccionTerminosBackendDto[]
}

function mapearTerminos(dto: TerminosBackendDto): TerminosPrivacidad {
  return {
    version: dto.version,
    fechaVigencia: dto.effectiveDate,
    titulo: dto.title,
    secciones: dto.sections.map((seccion) => ({
      titulo: seccion.title,
      parrafos: seccion.paragraphs,
    })),
  }
}

export class PrivacidadHttpRepository implements PrivacidadRepository {
  private readonly http: AxiosInstance

  constructor(http: AxiosInstance = httpClient) {
    this.http = http
  }

  async obtenerTerminos(): Promise<TerminosPrivacidad> {
    const { data } = await this.http.get<TerminosBackendDto>('/privacy/terms')
    return mapearTerminos(data)
  }

  async actualizarTerminos(datos: TerminosPrivacidad): Promise<TerminosPrivacidad> {
    const payload = {
      version: datos.version,
      effectiveDate: datos.fechaVigencia,
      title: datos.titulo,
      sections: datos.secciones.map((s) => ({ title: s.titulo, paragraphs: s.parrafos })),
    }
    const { data } = await this.http.put<TerminosBackendDto>('/privacy/terms', payload)
    return mapearTerminos(data)
  }
}
