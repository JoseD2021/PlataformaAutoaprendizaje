import type { Rol } from '../../auth/domain/entities'

export interface UsuarioAdmin {
  id: string
  email: string
  nombreCompleto: string
  rol: Rol
  activo: boolean
}

export interface PaginaUsuarios {
  items: UsuarioAdmin[]
  total: number
  pagina: number
  limite: number
}

export interface RolInfo {
  rol: Rol
  nombre: string
  rango: number
}