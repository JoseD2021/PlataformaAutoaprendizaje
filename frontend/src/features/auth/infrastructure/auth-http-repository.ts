import type { AxiosInstance } from 'axios'
import { httpClient } from '../../../shared/http/client'
import { guardarTokens, limpiarTokens } from '../../../shared/http/token-storage'
import { PERMISOS, type Permiso } from '../../../shared/permisos'
import type { AuthRepository } from '../domain/auth-repository'
import type { Credenciales, DatosRegistro, SesionIniciada, Usuario } from '../domain/entities'

const VALORES_PERMISO = new Set<string>(PERMISOS.map((permiso) => permiso.valor))

interface UsuarioBackendDto {
  id: string
  email: string
  fullName: string
  role: string
  roleRank?: number
  permissions?: string[]
  isActive: boolean
  privacyTermsVersion: string | null
  requiresPrivacyTermsAcceptance: boolean
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
    rango: dto.roleRank,
    permisos: (dto.permissions ?? []).filter((permiso): permiso is Permiso =>
      VALORES_PERMISO.has(permiso),
    ),
    activo: dto.isActive,
    versionTerminosPrivacidad: dto.privacyTermsVersion ?? null,
    requiereAceptarTerminosPrivacidad: dto.requiresPrivacyTermsAcceptance ?? false,
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
      privacyTermsAccepted: datos.aceptaTerminos,
      privacyTermsVersion: datos.versionTerminosPrivacidad,
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

  async aceptarTerminosPrivacidad(version: string): Promise<Usuario> {
    const { data } = await this.http.post<UsuarioBackendDto>('/auth/privacy-terms/accept', {
      privacyTermsAccepted: true,
      privacyTermsVersion: version,
    })
    return mapearUsuario(data)
  }

  async cambiarNombre(nombreCompleto: string): Promise<void> {
    await this.http.patch('/auth/me/name', { fullName: nombreCompleto.trim() })
  }

  async cambiarContrasena(contrasenaActual: string, contrasenaNueva: string): Promise<void> {
    await this.http.patch('/auth/me/password', {
      currentPassword: contrasenaActual,
      newPassword: contrasenaNueva,
    })
  }

  async eliminarCuenta(): Promise<void> {
    await this.http.delete('/auth/me')
    limpiarTokens()
  }
}
