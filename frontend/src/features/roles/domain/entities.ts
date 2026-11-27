import type { Permiso } from './permisos'

export interface RolDetalle {
  rol: string
  nombre: string
  rango: number
  permisos: Permiso[]
}

export interface DatosNuevoRol {
  rol: string
  nombre: string
  rango: number
  permisos: Permiso[]
}
