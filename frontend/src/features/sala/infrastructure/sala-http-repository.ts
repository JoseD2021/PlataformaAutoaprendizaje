import type { AxiosInstance } from "axios"
import type { SalaRepository } from "../domain/sala-repository"
import type { InformacionSala } from '../domain/entities'
import { httpClient } from '../../../shared/http/client'

export class SalaHttpRepository implements SalaRepository {
  private readonly http: AxiosInstance

  constructor(http: AxiosInstance = httpClient) {
    this.http = http
  }

  async obtenerInformacion(): Promise<InformacionSala>{
    const { data } = await this.http.get<InformacionSala>('/sala/informacion')
    return data
  }
}
