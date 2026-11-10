export type Rol = 'administrador' | 'personal_clena' | 'usuario'

export interface Usuario {
  id: string
  email: string
  nombreCompleto: string
  rol: Rol
  activo: boolean
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
}
