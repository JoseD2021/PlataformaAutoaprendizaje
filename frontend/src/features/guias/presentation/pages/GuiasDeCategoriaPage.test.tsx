import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { GuiasDeCategoriaPage } from './GuiasDeCategoriaPage'
import { httpClient } from '../../../../shared/http/client'

const categoriasBackendMock = [
  {
    id: 'correo',
    name: 'Correo Gmail',
    slug: 'correo-gmail',
    iconName: 'mail',
    description: 'Entrar a tu correo, escribir un mensaje y mandar fotos a tu familia.',
    isFeatured: true,
  },
]

const guiasBackendMock = {
  items: [
    {
      id: 'enviar-correo-foto',
      titulo: 'Enviar un correo con una foto',
      categoriaId: 'correo',
      totalPasos: 4,
      minutosEstimados: 3,
      esMasPedida: true,
      etiqueta: 'Recomendada',
    },
  ],
  total: 1,
  page: 1,
  limit: 100,
}

function renderizar(categoriaId: string = 'correo') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[`/categorias/${categoriaId}`]}>
        <Routes>
          <Route path="/categorias/:id" element={<GuiasDeCategoriaPage />} />
          <Route path="/" element={<div>Inicio</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('GuiasDeCategoriaPage', () => {
  beforeEach(() => {
    vi.spyOn(httpClient, 'get').mockImplementation(async (url) => {
      if (url === '/categories') {
        return { data: categoriasBackendMock } as AxiosResponse
      }
      if (url === '/guides') {
        return { data: guiasBackendMock } as AxiosResponse
      }
      return { data: null } as AxiosResponse
    })
  })

  it('muestra el título de la categoría y las guías asociadas', async () => {
    renderizar('correo-gmail')

    expect(await screen.findByRole('heading', { name: 'Correo Gmail' })).toBeInTheDocument()
    expect(screen.getByText('Enviar un correo con una foto')).toBeInTheDocument()
    expect(httpClient.get).toHaveBeenCalledWith('/guides', {
      params: { categoriaId: 'correo', limit: 100 },
    })

    const enlaceGuia = screen.getByRole('link', { name: /Enviar un correo con una foto/i })
    expect(enlaceGuia).toHaveAttribute('href', '/guias/enviar-correo-foto')
  })

  it('cuenta con enlace para volver al inicio', async () => {
    renderizar('correo')

    const enlaceVolver = await screen.findByRole('link', { name: /Volver al inicio/i })
    expect(enlaceVolver).toHaveAttribute('href', '/')
  })
})
