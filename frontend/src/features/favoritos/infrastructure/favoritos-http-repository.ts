import type { AxiosInstance } from 'axios'
import type { FavoritosRepository } from '../domain/favoritos-repository'
import type { GuiaResumen } from '../../guias/domain/entities'
import { httpClient } from '../../../shared/http/client'

interface GuiaResumenBackendDto {
  id: string
  titulo: string
  categoriaId: string
  totalPasos: number
  minutosEstimados: number
  esMasPedida: boolean
  etiqueta?: string
}

export class FavoritosHttpRepository implements FavoritosRepository {
  private readonly http: AxiosInstance

  constructor(http: AxiosInstance = httpClient) {
    this.http = http
  }

  async listar(): Promise<GuiaResumen[]> {
    const { data } = await this.http.get<GuiaResumenBackendDto[]>('/favorites')

    return data.map((item) => ({
      id: item.id,
      titulo: item.titulo,
      categoriaId: item.categoriaId,
      totalPasos: item.totalPasos,
      minutosEstimados: item.minutosEstimados,
      esMasPedida: item.esMasPedida,
      etiqueta: item.etiqueta,
    }))
  }

  async agregar(guiaId: string): Promise<void> {
    await this.http.put(`/favorites/${encodeURIComponent(guiaId)}`)
  }

  async quitar(guiaId: string): Promise<void> {
    await this.http.delete(`/favorites/${encodeURIComponent(guiaId)}`)
  }
}
