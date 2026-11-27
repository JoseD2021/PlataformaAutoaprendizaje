import type { Permiso } from '../../../shared/permisos'

export type Rol = string

export interface Usuario {
  id: string
  email: string
  nombreCompleto: string
  rol: Rol
  rango?: number
  permisos?: Permiso[]
  activo: boolean
  versionTerminosPrivacidad: string | null
  requiereAceptarTerminosPrivacidad: boolean
}

export interface Tokens {
  accessToken: string
  refreshToken: string
  expiraEnSegundos: number
}

export interface SesionIniciada {
  usuario: Usuario
  tokens: Tokens
}

export interface Credenciales {
  email: string
  password: string
}

export interface DatosRegistro {
  email: string
  password: string
  nombreCompleto: string
  aceptaTerminos: boolean
  versionTerminosPrivacidad: string
}
