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
      activo: true,
    })
    expect(obtenerTokens()).toEqual({ accessToken: 'access-1', refreshToken: 'refresh-1' })
  })

  it('registrar llama a /auth/register traduciendo nombreCompleto a fullName', async () => {
    const usuarioBackend = {
      id: 'u2',
      email: 'ana@clena.local',
      fullName: 'Ana Pérez',
      role: 'usuario',
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
    })

    expect(httpMock.post).toHaveBeenCalledWith('/auth/register', {
      email: 'ana@clena.local',
      password: 'Secreta123',
      fullName: 'Ana Pérez',
    })
    expect(resultado).toEqual({
      id: 'u2',
      email: 'ana@clena.local',
      nombreCompleto: 'Ana Pérez',
      rol: 'usuario',
      activo: true,
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

  it('obtenerPerfil llama a /auth/me y mapea el usuario', async () => {
    const usuarioBackend = {
      id: 'u3',
      email: 'admin@clena.local',
      fullName: 'Admin',
      role: 'administrador',
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
      activo: true,
    })
  })
})
