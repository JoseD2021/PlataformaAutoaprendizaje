import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { RegistroPage } from './RegistroPage'
import { httpClient } from '../../../../shared/http/client'
import { limpiarTokens } from '../../../../shared/http/token-storage'
import { AuthProvider } from '../context/AuthContext'

function crearError409(mensaje: string): AxiosError {
  const error = new AxiosError('Conflict', 'ERR_BAD_REQUEST')
  error.response = {
    status: 409,
    statusText: 'Conflict',
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
        <MemoryRouter initialEntries={['/registro']}>
          <Routes>
            <Route path="/registro" element={<RegistroPage />} />
            <Route path="/" element={<div>Inicio</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>,
  )
}

function completarFormulario() {
  fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: 'Ana Pérez' } })
  fireEvent.change(screen.getByLabelText('Correo electrónico'), {
    target: { value: 'ana@clena.local' },
  })
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'Secreta123' } })
}

describe('RegistroPage', () => {
  beforeEach(() => {
    limpiarTokens()
  })

  it('registra y luego inicia sesión automáticamente', async () => {
    vi.spyOn(httpClient, 'post').mockImplementation(async (url) => {
      if (url === '/auth/register') {
        return {
          data: {
            id: 'u1',
            email: 'ana@clena.local',
            fullName: 'Ana Pérez',
            role: 'usuario',
            isActive: true,
          },
        } as AxiosResponse
      }
      if (url === '/auth/login') {
        return {
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
        } as AxiosResponse
      }
      throw new Error(`url inesperada: ${url}`)
    })

    renderizar()
    completarFormulario()
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    await waitFor(() => expect(screen.getByText('Inicio')).toBeInTheDocument())
  })

  it('muestra el error cuando el correo ya está registrado', async () => {
    vi.spyOn(httpClient, 'post').mockRejectedValue(
      crearError409('Ya existe un usuario registrado con el correo ana@clena.local.'),
    )

    renderizar()
    completarFormulario()
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Ya existe un usuario registrado con el correo ana@clena.local.',
    )
  })
})
