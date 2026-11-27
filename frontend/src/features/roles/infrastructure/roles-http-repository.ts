import type { AxiosInstance } from 'axios'
import { httpClient } from '../../../shared/http/client'
import type { Permiso } from '../domain/permisos'
import type { RolesRepository } from '../domain/roles-repository'
import type { DatosNuevoRol, RolDetalle } from '../domain/entities'

interface RolDto {
  role: string
  name: string
  rank: number
  permissions: Permiso[]
}

function mapearRol(dto: RolDto): RolDetalle {
  return {
    rol: dto.role,
    nombre: dto.name,
    rango: dto.rank,
    permisos: dto.permissions ?? [],
  }
}

export class RolesHttpRepository implements RolesRepository {
  private readonly http: AxiosInstance

  constructor(http: AxiosInstance = httpClient) {
    this.http = http
  }

  async listar(): Promise<RolDetalle[]> {
    const { data } = await this.http.get<RolDto[]>('/roles')
    return data.map(mapearRol).toSorted((a, b) => b.rango - a.rango)
  }

  async crear(datos: DatosNuevoRol): Promise<RolDetalle> {
    const { data } = await this.http.post<RolDto>('/roles', {
      role: datos.rol,
      name: datos.nombre,
      rank: datos.rango,
      permissions: datos.permisos,
    })
    return mapearRol(data)
  }

  async actualizarPermisos(rol: string, permisos: Permiso[]): Promise<RolDetalle> {
    const { data } = await this.http.patch<RolDto>(
      `/roles/${encodeURIComponent(rol)}/permissions`,
      { permissions: permisos },
    )
    return mapearRol(data)
  }

  async eliminar(rol: string): Promise<void> {
    await this.http.delete(`/roles/${encodeURIComponent(rol)}`)
  }
}
