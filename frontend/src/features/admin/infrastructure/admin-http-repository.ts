import type { AxiosInstance } from 'axios'
import { httpClient } from '../../../shared/http/client'
import type { Rol } from '../../auth/domain/entities'
import type { AdminRepository } from '../domain/admin-repository'
import type { PaginaUsuarios, RolInfo } from '../domain/entities'

interface UsuarioDto {
  id: string
  email: string
  fullName: string
  role: Rol
  isActive: boolean
}

interface PaginaUsuariosDto {
  items: UsuarioDto[]
  total: number
  page: number
  limit: number
}

interface RolDto {
  role: Rol
  name: string
  rank: number
}

export class AdminHttpRepository implements AdminRepository {
  private readonly http: AxiosInstance

  constructor(http: AxiosInstance = httpClient) {
    this.http = http
  }

  async listarUsuarios(pagina: number, limite: number): Promise<PaginaUsuarios> {
    const { data } = await this.http.get<PaginaUsuariosDto>('/users', {
      params: { page: pagina, limit: limite },
    })
    return {
      items: data.items.map((u) => ({
        id: u.id,
        email: u.email,
        nombreCompleto: u.fullName,
        rol: u.role,
        activo: u.isActive,
      })),
      total: data.total,
      pagina: data.page,
      limite: data.limit,
    }
  }

  async cambiarRol(usuarioId: string, rol: Rol): Promise<void> {
    await this.http.patch(`/users/${encodeURIComponent(usuarioId)}/role`, { role: rol })
  }

  async listarRoles(): Promise<RolInfo[]> {
    const { data } = await this.http.get<RolDto[]>('/roles')
    return data
      .map((r) => ({ rol: r.role, nombre: r.name, rango: r.rank }))
      .toSorted((a, b) => b.rango - a.rango)
  }
}