import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { LoginPage } from './LoginPage'
import { httpClient } from '../../../../shared/http/client'
import { limpiarTokens, obtenerTokens } from '../../../../shared/http/token-storage'
import { AuthProvider } from '../context/AuthContext'

function crearError401(mensaje: string): AxiosError {
  const error = new AxiosError('Unauthorized', 'ERR_BAD_REQUEST')
  error.response = {
    status: 401,
    statusText: 'Unauthorized',
    data: { error: { message: mensaje } },
    headers: {},
    config: {} as InternalAxiosRequestConfig,
  }
  return error
}

function renderizar() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <AuthProvider>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<div>Inicio</div>} />
            <Route path="/admin" element={<div>Panel admin</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>,
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    limpiarTokens()
  })

  it('inicia sesión con credenciales válidas y redirige al inicio', async () => {
    vi.spyOn(httpClient, 'post').mockResolvedValue({
      data: {
        user: {
          id: 'u1',
          email: 'ana@clena.local',
          fullName: 'Ana Pérez',
          role: 'usuario',
          isActive: true,
        },
        tokens: {
          accessToken: 'a',
          refreshToken: 'r',
          tokenType: 'Bearer',
          accessTokenExpiresIn: 900,
          refreshTokenExpiresIn: 604800,
        },
      },
    } as AxiosResponse)

    renderizar()

    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'ana@clena.local' },
    })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'Secreta123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

    await waitFor(() => expect(screen.getByText('Inicio')).toBeInTheDocument())
    expect(obtenerTokens()).toEqual({ accessToken: 'a', refreshToken: 'r' })
  })

  it('redirige al panel admin cuando el usuario tiene rol administrador', async () => {
    vi.spyOn(httpClient, 'post').mockResolvedValue({
      data: {
        user: {
          id: 'u-admin',
          email: 'admin@clena.local',
          fullName: 'Admin CLENA',
          role: 'administrador',
          isActive: true,
        },
        tokens: {
          accessToken: 'a',
          refreshToken: 'r',
          tokenType: 'Bearer',
          accessTokenExpiresIn: 900,
          refreshTokenExpiresIn: 604800,
        },
      },
    } as AxiosResponse)

    renderizar()

    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'admin@clena.local' },
    })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'Secreta123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

    await waitFor(() => expect(screen.getByText('Panel admin')).toBeInTheDocument())
  })

  it('muestra un error cuando las credenciales son inválidas', async () => {
    vi.spyOn(httpClient, 'post').mockRejectedValue(
      crearError401('El correo o la contraseña son incorrectos.'),
    )

    renderizar()

    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'ana@clena.local' },
    })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'mala-clave' } })
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'El correo o la contraseña son incorrectos.',
    )
  })
})
