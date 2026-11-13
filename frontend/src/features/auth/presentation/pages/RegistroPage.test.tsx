import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { RegistroPage } from './RegistroPage'
import { httpClient } from '../../../../shared/http/client'
import { limpiarTokens } from '../../../../shared/http/token-storage'
import { AuthProvider } from '../context/AuthContext'

const TERMINOS_PRIVACIDAD = {
  version: '1.0',
  effectiveDate: '2026-11-12',
  title: 'Aviso de privacidad de prueba',
  sections: [
    {
      title: 'Datos que recopilamos',
      paragraphs: ['Solo usamos tus datos para crear tu cuenta.'],
    },
  ],
}

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

function simularTerminosPrivacidad() {
  return vi
    .spyOn(httpClient, 'get')
    .mockResolvedValue({ data: TERMINOS_PRIVACIDAD } as AxiosResponse)
}

async function completarFormulario() {
  fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: 'Ana Pérez' } })
  fireEvent.change(screen.getByLabelText('Correo electrónico'), {
    target: { value: 'ana@clena.local' },
  })
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'Secreta123' } })
  fireEvent.click(
    await screen.findByLabelText(/He leído y acepto el aviso de privacidad/),
  )
}

describe('RegistroPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    limpiarTokens()
  })

  it('registra y luego inicia sesión automáticamente', async () => {
    simularTerminosPrivacidad()
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
    await completarFormulario()
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    await waitFor(() => expect(screen.getByText('Inicio')).toBeInTheDocument())
    expect(httpClient.post).toHaveBeenCalledWith('/auth/register', {
      email: 'ana@clena.local',
      password: 'Secreta123',
      fullName: 'Ana Pérez',
      privacyTermsAccepted: true,
      privacyTermsVersion: '1.0',
    })
  })

  it('muestra el error cuando el correo ya está registrado', async () => {
    simularTerminosPrivacidad()
    vi.spyOn(httpClient, 'post').mockRejectedValue(
      crearError409('Ya existe un usuario registrado con el correo ana@clena.local.'),
    )

    renderizar()
    await completarFormulario()
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Ya existe un usuario registrado con el correo ana@clena.local.',
    )
  })

  it('mantiene deshabilitado el botón hasta aceptar el aviso de privacidad', async () => {
    simularTerminosPrivacidad()
    renderizar()

    const checkbox = await screen.findByLabelText(/He leído y acepto el aviso de privacidad/)
    const boton = screen.getByRole('button', { name: 'Crear cuenta' })

    expect(boton).toBeDisabled()

    fireEvent.click(checkbox)

    expect(boton).toBeEnabled()
  })

  it('permite leer el aviso de privacidad antes de aceptarlo', async () => {
    simularTerminosPrivacidad()
    renderizar()

    fireEvent.click(
      await screen.findByRole('button', { name: /Leer el aviso de privacidad/ }),
    )

    const dialogo = document.querySelector('dialog.terminos-dialog')
    expect(dialogo).toHaveAttribute('open')
    expect(screen.getByText('Aviso de privacidad de prueba')).toBeInTheDocument()
    expect(screen.getByText('Solo usamos tus datos para crear tu cuenta.')).toBeInTheDocument()
  })
})
