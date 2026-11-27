import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AxiosInstance, AxiosResponse } from 'axios'
import { AuthHttpRepository } from './auth-http-repository'
import { guardarTokens, limpiarTokens, obtenerTokens } from '../../../shared/http/token-storage'

describe('AuthHttpRepository', () => {
  beforeEach(() => {
    limpiarTokens()
  })

  it('iniciarSesion llama a /auth/login, mapea el usuario y guarda los tokens', async () => {
    const respuestaBackend = {
      user: {
        id: 'u1',
        email: 'ana@clena.local',
        fullName: 'Ana Pérez',
        role: 'usuario',
        roleRank: 10,
        permissions: ['favorites:manage', 'help-requests:create'],
        isActive: true,
      },
      tokens: {
        accessToken: 'access-1',
        refreshToken: 'refresh-1',
        tokenType: 'Bearer',
        accessTokenExpiresIn: 900,
        refreshTokenExpiresIn: 604800,
      },
    }
    const httpMock = {
      post: vi.fn().mockResolvedValue({ data: respuestaBackend } as AxiosResponse),
    } as unknown as AxiosInstance

    const repo = new AuthHttpRepository(httpMock)
    const resultado = await repo.iniciarSesion({ email: 'ana@clena.local', password: 'Secreta123' })

    expect(httpMock.post).toHaveBeenCalledWith('/auth/login', {
      email: 'ana@clena.local',
      password: 'Secreta123',
    })
    expect(resultado.usuario).toEqual({
      id: 'u1',
      email: 'ana@clena.local',
      nombreCompleto: 'Ana Pérez',
      rol: 'usuario',
      rango: 10,
      permisos: ['favorites:manage', 'help-requests:create'],
      activo: true,
      versionTerminosPrivacidad: null,
      requiereAceptarTerminosPrivacidad: false,
    })
    expect(obtenerTokens()).toEqual({ accessToken: 'access-1', refreshToken: 'refresh-1' })
  })

  it('registrar llama a /auth/register traduciendo nombreCompleto a fullName', async () => {
    const usuarioBackend = {
      id: 'u2',
      email: 'ana@clena.local',
      fullName: 'Ana Pérez',
      role: 'usuario',
      roleRank: 10,
      permissions: ['favorites:manage', 'help-requests:create'],
      isActive: true,
    }
    const httpMock = {
      post: vi.fn().mockResolvedValue({ data: usuarioBackend } as AxiosResponse),
    } as unknown as AxiosInstance

    const repo = new AuthHttpRepository(httpMock)
    const resultado = await repo.registrar({
      email: 'ana@clena.local',
      password: 'Secreta123',
      nombreCompleto: 'Ana Pérez',
      aceptaTerminos: true,
      versionTerminosPrivacidad: '1.0',
    })

    expect(httpMock.post).toHaveBeenCalledWith('/auth/register', {
      email: 'ana@clena.local',
      password: 'Secreta123',
      fullName: 'Ana Pérez',
      privacyTermsAccepted: true,
      privacyTermsVersion: '1.0',
    })
    expect(resultado).toEqual({
      id: 'u2',
      email: 'ana@clena.local',
      nombreCompleto: 'Ana Pérez',
      rol: 'usuario',
      rango: 10,
      permisos: ['favorites:manage', 'help-requests:create'],
      activo: true,
      versionTerminosPrivacidad: null,
      requiereAceptarTerminosPrivacidad: false,
    })
  })

  it('cerrarSesion llama a /auth/logout y limpia los tokens almacenados', async () => {
    guardarTokens({ accessToken: 'a', refreshToken: 'r' })
    const httpMock = {
      post: vi.fn().mockResolvedValue({ data: undefined } as AxiosResponse),
    } as unknown as AxiosInstance

    const repo = new AuthHttpRepository(httpMock)
    await repo.cerrarSesion('r')

    expect(httpMock.post).toHaveBeenCalledWith('/auth/logout', { refreshToken: 'r' })
    expect(obtenerTokens()).toBeNull()
  })

  it('cambiarNombre llama a PATCH /auth/me/name con el nombre normalizado', async () => {
    const httpMock = {
      patch: vi.fn().mockResolvedValue({ data: undefined } as AxiosResponse),
    } as unknown as AxiosInstance

    const repo = new AuthHttpRepository(httpMock)
    await repo.cambiarNombre('  Ana Pérez  ')

    expect(httpMock.patch).toHaveBeenCalledWith('/auth/me/name', { fullName: 'Ana Pérez' })
  })

  it('cambiarContrasena llama a PATCH /auth/me/password con ambas contraseñas', async () => {
    const httpMock = {
      patch: vi.fn().mockResolvedValue({ data: undefined } as AxiosResponse),
    } as unknown as AxiosInstance

    const repo = new AuthHttpRepository(httpMock)
    await repo.cambiarContrasena('ClaveActual123', 'ClaveNueva123')

    expect(httpMock.patch).toHaveBeenCalledWith('/auth/me/password', {
      currentPassword: 'ClaveActual123',
      newPassword: 'ClaveNueva123',
    })
  })

  it('eliminarCuenta llama a DELETE /auth/me y limpia los tokens', async () => {
    guardarTokens({ accessToken: 'a', refreshToken: 'r' })
    const httpMock = {
      delete: vi.fn().mockResolvedValue({ data: undefined } as AxiosResponse),
    } as unknown as AxiosInstance

    const repo = new AuthHttpRepository(httpMock)
    await repo.eliminarCuenta()

    expect(httpMock.delete).toHaveBeenCalledWith('/auth/me')
    expect(obtenerTokens()).toBeNull()
  })

  it('obtenerPerfil llama a /auth/me y mapea permisos y rango', async () => {
    const usuarioBackend = {
      id: 'u3',
      email: 'admin@clena.local',
      fullName: 'Admin',
      role: 'administrador',
      roleRank: 30,
      permissions: ['users:read', 'roles:read'],
      isActive: true,
    }
    const httpMock = {
      get: vi.fn().mockResolvedValue({ data: usuarioBackend } as AxiosResponse),
    } as unknown as AxiosInstance

    const repo = new AuthHttpRepository(httpMock)
    const resultado = await repo.obtenerPerfil()

    expect(httpMock.get).toHaveBeenCalledWith('/auth/me')
    expect(resultado).toEqual({
      id: 'u3',
      email: 'admin@clena.local',
      nombreCompleto: 'Admin',
      rol: 'administrador',
      rango: 30,
      permisos: ['users:read', 'roles:read'],
      activo: true,
      versionTerminosPrivacidad: null,
      requiereAceptarTerminosPrivacidad: false,
    })
  })
})
