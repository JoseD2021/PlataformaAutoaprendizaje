import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { InicioPage } from './InicioPage'
import { httpClient } from '../../../../shared/http/client'

const categoriasBackend = [
  {
    id: 'correo',
    name: 'Correo Gmail',
    slug: 'correo-gmail',
    iconName: 'mail',
    description: 'Entrar a tu correo, escribir un mensaje y mandar fotos a tu familia.',
    isFeatured: true,
  },
  {
    id: 'tramites',
    name: 'Trámites en línea',
    slug: 'tramites-en-linea',
    iconName: 'landmark',
    description: 'Citas médicas, certificados y pagos',
    isFeatured: false,
  },
  {
    id: 'documentos',
    name: 'Documentos',
    slug: 'documentos',
    iconName: 'file-text',
    description: 'Escribir una carta, guardar e imprimir',
    isFeatured: false,
  },
  {
    id: 'redes',
    name: 'Redes sociales',
    iconName: 'users',
    description: 'Facebook y WhatsApp Web',
    isFeatured: false,
  },
  {
    id: 'seguridad',
    name: 'Seguridad en internet',
    slug: 'seguridad-en-internet',
    iconName: 'shield',
    description: 'Contraseñas, estafas y cerrar sesión',
    isFeatured: false,
  },
]

function renderizar() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <InicioPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('InicioPage', () => {
  beforeEach(() => {
    vi.spyOn(httpClient, 'get').mockImplementation(async (url) => {
      if (url === '/categories') {
        return { data: categoriasBackend } as AxiosResponse
      }
      return { data: [] } as AxiosResponse
    })
  })

  it('muestra el tema destacado y los otros temas', async () => {
    renderizar()
    expect(await screen.findByRole('heading', { name: 'Correo Gmail' })).toBeInTheDocument()
    expect(screen.getByText('Trámites en línea')).toBeInTheDocument()
    expect(screen.getByText('Documentos')).toBeInTheDocument()
    expect(screen.getByText('Redes sociales')).toBeInTheDocument()
    expect(screen.getByText('Seguridad en internet')).toBeInTheDocument()
  })

  it('cada tema enlaza a su lista de guías', async () => {
    renderizar()
    await screen.findByRole('heading', { name: 'Correo Gmail' })
    expect(screen.getByRole('link', { name: /Ver guías de Correo Gmail/ }))
      .toHaveAttribute('href', '/categorias/correo-gmail')
    expect(screen.getByRole('link', { name: /Documentos/ }))
      .toHaveAttribute('href', '/categorias/documentos')
    expect(screen.getByRole('link', { name: /Redes sociales/ }))
      .toHaveAttribute('href', '/categorias/redes')
  })
})
