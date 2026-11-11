import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { SeccionFavoritos } from './SeccionFavoritos'
import { httpClient } from '../../../../shared/http/client'
import { guardarTokens, limpiarTokens } from '../../../../shared/http/token-storage'
import { AuthProvider } from '../../../auth/presentation/context/AuthContext'

const usuarioBackend = {
  id: 'u1',
  email: 'ana@clena.local',
  fullName: 'Ana Pérez',
  role: 'usuario',
  isActive: true,
}

function renderizar() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <AuthProvider>
        <MemoryRouter>
          <SeccionFavoritos />
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>,
  )
}

describe('SeccionFavoritos', () => {
  beforeEach(() => {
    limpiarTokens()
  })

  it('no muestra nada si no hay sesión activa', () => {
    const { container } = renderizar()

    expect(container.firstChild).toBeNull()
  })

  it('muestra la lista de guías favoritas cuando hay sesión', async () => {
    guardarTokens({ accessToken: 'a', refreshToken: 'r' })
    vi.spyOn(httpClient, 'get').mockImplementation(async (url) => {
      if (url === '/auth/me') return { data: usuarioBackend } as AxiosResponse
      if (url === '/favorites') {
        return {
          data: [
            {
              id: 'enviar-correo-foto',
              titulo: 'Enviar un correo con una foto',
              categoriaId: 'correo',
              totalPasos: 4,
              minutosEstimados: 3,
              esMasPedida: true,
            },
          ],
        } as AxiosResponse
      }
      throw new Error(`url inesperada: ${url}`)
    })

    renderizar()

    expect(await screen.findByRole('heading', { name: 'Mis favoritos' })).toBeInTheDocument()
    expect(screen.getByText('Enviar un correo con una foto')).toBeInTheDocument()
  })

  it('muestra solo las primeras 4 guías y un enlace a "ver todos" si hay más favoritos', async () => {
    guardarTokens({ accessToken: 'a', refreshToken: 'r' })
    const favoritosBackend = Array.from({ length: 6 }, (_, i) => ({
      id: `guia-${i + 1}`,
      titulo: `Guía ${i + 1}`,
      categoriaId: 'correo',
      totalPasos: 1,
      minutosEstimados: 1,
      esMasPedida: false,
    }))
    vi.spyOn(httpClient, 'get').mockImplementation(async (url) => {
      if (url === '/auth/me') return { data: usuarioBackend } as AxiosResponse
      if (url === '/favorites') return { data: favoritosBackend } as AxiosResponse
      throw new Error(`url inesperada: ${url}`)
    })

    renderizar()

    await screen.findByRole('heading', { name: 'Mis favoritos' })
    expect(screen.getByText('Guía 1')).toBeInTheDocument()
    expect(screen.getByText('Guía 4')).toBeInTheDocument()
    expect(screen.queryByText('Guía 5')).not.toBeInTheDocument()

    const enlaceVerTodos = screen.getByRole('link', { name: 'Ver todos mis favoritos (6)' })
    expect(enlaceVerTodos).toHaveAttribute('href', '/favoritos')
  })

  it('no muestra el enlace "ver todos" si los favoritos no superan el límite', async () => {
    guardarTokens({ accessToken: 'a', refreshToken: 'r' })
    vi.spyOn(httpClient, 'get').mockImplementation(async (url) => {
      if (url === '/auth/me') return { data: usuarioBackend } as AxiosResponse
      if (url === '/favorites') {
        return {
          data: [
            {
              id: 'enviar-correo-foto',
              titulo: 'Enviar un correo con una foto',
              categoriaId: 'correo',
              totalPasos: 4,
              minutosEstimados: 3,
              esMasPedida: true,
            },
          ],
        } as AxiosResponse
      }
      throw new Error(`url inesperada: ${url}`)
    })

    renderizar()

    await screen.findByRole('heading', { name: 'Mis favoritos' })
    expect(screen.queryByRole('link', { name: /Ver todos mis favoritos/ })).not.toBeInTheDocument()
  })

  it('no muestra nada si hay sesión pero no hay favoritos guardados', async () => {
    guardarTokens({ accessToken: 'a', refreshToken: 'r' })
    vi.spyOn(httpClient, 'get').mockImplementation(async (url) => {
      if (url === '/auth/me') return { data: usuarioBackend } as AxiosResponse
      if (url === '/favorites') return { data: [] } as AxiosResponse
      throw new Error(`url inesperada: ${url}`)
    })

    renderizar()

    await waitFor(() => expect(httpClient.get).toHaveBeenCalledWith('/favorites'))
    expect(screen.queryByRole('heading', { name: 'Mis favoritos' })).not.toBeInTheDocument()
  })
})
