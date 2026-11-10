import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { BusquedaPage } from './BusquedaPage'
import { httpClient } from '../../../../shared/http/client'
import { AuthProvider } from '../../../auth/presentation/context/AuthContext'

const resultadosBackend = {
  items: [
    {
      id: 'enviar-correo-foto',
      title: 'Enviar un correo con una foto',
      estimatedMinutes: 3,
      categoryName: 'Correo',
    },
    {
      id: 'imprimir-foto',
      title: 'Imprimir una foto',
      estimatedMinutes: 5,
      categoryName: 'Documentos',
    },
  ],
  total: 2,
  page: 1,
  limit: 10,
  totalPages: 1,
}

function renderizar(ruta = '/buscar?q=foto') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <AuthProvider>
        <MemoryRouter initialEntries={[ruta]}>
          <Routes>
            <Route path="/buscar" element={<BusquedaPage />} />
            <Route path="/" element={<div>Inicio</div>} />
            <Route path="/guias/:id" element={<div>Detalle de guía</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>,
  )
}

describe('BusquedaPage', () => {
  beforeEach(() => {
    vi.spyOn(httpClient, 'get').mockImplementation(async (url) => {
      if (url === '/guides/search') {
        return { data: resultadosBackend } as AxiosResponse
      }
      return { data: null } as AxiosResponse
    })
  })

  it('busca con la consulta de la URL y muestra los resultados', async () => {
    renderizar('/buscar?q=foto')

    expect(httpClient.get).toHaveBeenCalledWith('/guides/search', {
      params: { q: 'foto', page: 1, limit: 10 },
    })
    expect(await screen.findByText('Enviar un correo con una foto')).toBeInTheDocument()
    expect(screen.getByText('Imprimir una foto')).toBeInTheDocument()
    expect(screen.getByText('Encontramos 2 guías:')).toBeInTheDocument()
    expect(screen.getByText('Correo')).toBeInTheDocument()
    expect(screen.getByText('Documentos')).toBeInTheDocument()
  })

  it('cada resultado enlaza a su guía paso a paso', async () => {
    renderizar('/buscar?q=foto')

    const enlace = await screen.findByRole('link', { name: /Enviar un correo con una foto/i })
    expect(enlace).toHaveAttribute('href', '/guias/enviar-correo-foto')
  })

  it('muestra un mensaje amable cuando no hay resultados', async () => {
    vi.spyOn(httpClient, 'get').mockImplementation(async (url) => {
      if (url === '/guides/search') {
        return { data: { items: [], total: 0, page: 1, limit: 10, totalPages: 0 } } as AxiosResponse
      }
      return { data: null } as AxiosResponse
    })

    renderizar('/buscar?q=inexistente')

    expect(await screen.findByText(/No encontramos guías para «inexistente»/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Volver al inicio/i })).toHaveAttribute('href', '/')
  })

  it('no busca y muestra un aviso si la consulta es demasiado corta', async () => {
    vi.mocked(httpClient.get).mockClear()
    renderizar('/buscar?q=f')

    expect(await screen.findByText(/Escribe al menos dos letras/)).toBeInTheDocument()
    expect(httpClient.get).not.toHaveBeenCalled()
  })

  it('precarga el buscador con la consulta actual', async () => {
    renderizar('/buscar?q=foto')

    expect(await screen.findByDisplayValue('foto')).toBeInTheDocument()
  })
})
