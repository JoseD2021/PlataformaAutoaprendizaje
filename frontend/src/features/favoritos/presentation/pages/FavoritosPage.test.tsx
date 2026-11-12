import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { FavoritosPage } from './FavoritosPage'
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
          <FavoritosPage />
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>,
  )
}

describe('FavoritosPage', () => {
  beforeEach(() => {
    limpiarTokens()
  })

  it('invita a iniciar sesión si no hay sesión activa', async () => {
    renderizar()

    expect(await screen.findByRole('link', { name: 'iniciar sesión' })).toHaveAttribute(
      'href',
      '/login',
    )
  })

  it('muestra todas las guías favoritas, sin límite', async () => {
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

    expect(await screen.findByText('Guía 1')).toBeInTheDocument()
    expect(screen.getByText('Guía 6')).toBeInTheDocument()
  })

  it('muestra un mensaje si hay sesión pero no hay favoritos', async () => {
    guardarTokens({ accessToken: 'a', refreshToken: 'r' })
    vi.spyOn(httpClient, 'get').mockImplementation(async (url) => {
      if (url === '/auth/me') return { data: usuarioBackend } as AxiosResponse
      if (url === '/favorites') return { data: [] } as AxiosResponse
      throw new Error(`url inesperada: ${url}`)
    })

    renderizar()

    expect(
      await screen.findByText('Todavía no has guardado ninguna guía en favoritos.'),
    ).toBeInTheDocument()
  })
})
