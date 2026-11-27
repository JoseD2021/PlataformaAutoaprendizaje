import type { AxiosInstance } from 'axios'
import { httpClient } from '../../../shared/http/client'
import type { DudasRepository } from '../domain/dudas-repository'
import type { CategoriaDuda, Duda, NuevaDuda } from '../domain/entities'

interface DudaBackendDto {
  id: string
  duda: string
  tema: string
  veces: number
  ultimaVez: string
}

interface CategoriaBackendDto {
  id: string
  name: string
}

function aDuda(dto: DudaBackendDto): Duda {
  return {
    id: dto.id,
    duda: dto.duda,
    tema: dto.tema,
    veces: dto.veces,
    ultimaVez: dto.ultimaVez,
  }
}

export class DudasHttpRepository implements DudasRepository {
  private readonly http: AxiosInstance

  constructor(http: AxiosInstance = httpClient) {
    this.http = http
  }

  async listar(): Promise<Duda[]> {
    const { data } = await this.http.get<DudaBackendDto[]>('/doubts')
    return data.map(aDuda)
  }

  async anotar(nueva: NuevaDuda): Promise<Duda> {
    const { data } = await this.http.post<DudaBackendDto>('/doubts', nueva)
    return aDuda(data)
  }

  async eliminar(id: string): Promise<void> {
    await this.http.delete(`/doubts/${encodeURIComponent(id)}`)
  }

  async listarCategorias(): Promise<CategoriaDuda[]> {
    const { data } = await this.http.get<CategoriaBackendDto[]>('/categories')
    return data
      .map((categoria) => ({ id: categoria.id, nombre: categoria.name }))
      .toSorted((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
  }
}
