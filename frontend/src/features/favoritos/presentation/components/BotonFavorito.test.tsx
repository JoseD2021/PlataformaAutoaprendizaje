import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { BotonFavorito } from './BotonFavorito'
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

function renderizar(guiaId = 'enviar-correo-foto') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <AuthProvider>
        <BotonFavorito guiaId={guiaId} />
      </AuthProvider>
    </QueryClientProvider>,
  )
}

describe('BotonFavorito', () => {
  beforeEach(() => {
    limpiarTokens()
  })

  it('no muestra nada si no hay sesión activa', () => {
    const { container } = renderizar()

    expect(container.firstChild).toBeNull()
  })

  it('permite marcar y desmarcar una guía como favorita', async () => {
    guardarTokens({ accessToken: 'a', refreshToken: 'r' })
    let favoritoGuardado = false

    vi.spyOn(httpClient, 'get').mockImplementation(async (url) => {
      if (url === '/auth/me') return { data: usuarioBackend } as AxiosResponse
      if (url === '/favorites') {
        return {
          data: favoritoGuardado
            ? [
                {
                  id: 'enviar-correo-foto',
                  titulo: 'Enviar un correo con una foto',
                  categoriaId: 'correo',
                  totalPasos: 4,
                  minutosEstimados: 3,
                  esMasPedida: true,
                },
              ]
            : [],
        } as AxiosResponse
      }
      throw new Error(`url inesperada: ${url}`)
    })
    vi.spyOn(httpClient, 'put').mockImplementation(async () => {
      favoritoGuardado = true
      return {} as AxiosResponse
    })
    vi.spyOn(httpClient, 'delete').mockImplementation(async () => {
      favoritoGuardado = false
      return {} as AxiosResponse
    })

    renderizar('enviar-correo-foto')

    const boton = await screen.findByRole('button', { name: 'Guardar en favoritos' })
    fireEvent.click(boton)

    expect(
      await screen.findByRole('button', { name: 'Guardada en favoritos' }),
    ).toBeInTheDocument()
    expect(httpClient.put).toHaveBeenCalledWith('/favorites/enviar-correo-foto')

    fireEvent.click(screen.getByRole('button', { name: 'Guardada en favoritos' }))

    expect(
      await screen.findByRole('button', { name: 'Guardar en favoritos' }),
    ).toBeInTheDocument()
    expect(httpClient.delete).toHaveBeenCalledWith('/favorites/enviar-correo-foto')
  })
})
