import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { InicioPage } from './InicioPage'

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
      .toHaveAttribute('href', '/categorias/correo')
    expect(screen.getByRole('link', { name: /Documentos/ }))
      .toHaveAttribute('href', '/categorias/documentos')
  })
})