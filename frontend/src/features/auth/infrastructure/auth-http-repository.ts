import type { AxiosInstance } from 'axios'
import { httpClient } from '../../../shared/http/client'
import { guardarTokens, limpiarTokens } from '../../../shared/http/token-storage'
import type { AuthRepository } from '../domain/auth-repository'
import type { Credenciales, DatosRegistro, Rol, SesionIniciada, Usuario } from '../domain/entities'

interface UsuarioBackendDto {
  id: string
  email: string
  fullName: string
  role: Rol
  isActive: boolean
}

interface AuthResponseBackendDto {
  user: UsuarioBackendDto
  tokens: {
    accessToken: string
    refreshToken: string
    accessTokenExpiresIn: number
  }
}

function mapearUsuario(dto: UsuarioBackendDto): Usuario {
  return {
    id: dto.id,
    email: dto.email,
    nombreCompleto: dto.fullName,
    rol: dto.role,
    activo: dto.isActive,
  }
}

function mapearSesion(dto: AuthResponseBackendDto): SesionIniciada {
  return {
    usuario: mapearUsuario(dto.user),
    tokens: {
      accessToken: dto.tokens.accessToken,
      refreshToken: dto.tokens.refreshToken,
      expiraEnSegundos: dto.tokens.accessTokenExpiresIn,
    },
  }
}

export class AuthHttpRepository implements AuthRepository {
  private readonly http: AxiosInstance

  constructor(http: AxiosInstance = httpClient) {
    this.http = http
  }

  async iniciarSesion(credenciales: Credenciales): Promise<SesionIniciada> {
    const { data } = await this.http.post<AuthResponseBackendDto>('/auth/login', credenciales)
    const sesion = mapearSesion(data)
    guardarTokens({ accessToken: sesion.tokens.accessToken, refreshToken: sesion.tokens.refreshToken })
    return sesion
  }

  async registrar(datos: DatosRegistro): Promise<Usuario> {
    const { data } = await this.http.post<UsuarioBackendDto>('/auth/register', {
      email: datos.email,
      password: datos.password,
      fullName: datos.nombreCompleto,
    })
    return mapearUsuario(data)
  }

  async cerrarSesion(refreshToken: string): Promise<void> {
    try {
      await this.http.post('/auth/logout', { refreshToken })
    } finally {
      limpiarTokens()
    }
  }

  async obtenerPerfil(): Promise<Usuario> {
    const { data } = await this.http.get<UsuarioBackendDto>('/auth/me')
    return mapearUsuario(data)
  }
}
