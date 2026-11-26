import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { container } from '../../../../app/container'
import { CategoriasGestionPanel } from './CategoriasGestionPanel'

function renderizar() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <CategoriasGestionPanel />
    </QueryClientProvider>,
  )
}

describe('CategoriasGestionPanel', () => {
  afterEach(() => vi.restoreAllMocks())

  it('avisa con un modal antes de quitar el destacado a otra categoría', async () => {
    vi.spyOn(container.listarCategoriasGestion, 'execute').mockResolvedValue([
      { id: 'c1', nombre: 'Correo', icono: 'mail', descripcion: 'Enviar mensajes', esDestacada: true },
    ])
    const crearCategoria = vi.spyOn(container.crearCategoria, 'execute').mockResolvedValue(undefined)
    renderizar()
    await screen.findByText('Correo')

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Documentos' } })
    fireEvent.change(screen.getByLabelText('Descripción corta'), { target: { value: 'Imprimir cartas' } })
    fireEvent.click(screen.getByLabelText('Mostrar como «tema más pedido» en el inicio'))
    fireEvent.click(screen.getByRole('button', { name: /Crear categoría/ }))

    const dialogo = await screen.findByRole('dialog')
    expect(dialogo).toHaveAttribute('open')
    expect(screen.getByText(/Se quitará el destacado de/)).toHaveTextContent('Correo')
    expect(crearCategoria).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: /Continuar/ }))

    await waitFor(() => {
      expect(crearCategoria).toHaveBeenCalledWith(
        expect.objectContaining({ nombre: 'Documentos', esDestacada: true }),
      )
    })
  })

  it('no guarda si se cancela el aviso', async () => {
    vi.spyOn(container.listarCategoriasGestion, 'execute').mockResolvedValue([
      { id: 'c1', nombre: 'Correo', icono: 'mail', descripcion: 'Enviar mensajes', esDestacada: true },
    ])
    const crearCategoria = vi.spyOn(container.crearCategoria, 'execute').mockResolvedValue(undefined)
    renderizar()
    await screen.findByText('Correo')

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Documentos' } })
    fireEvent.change(screen.getByLabelText('Descripción corta'), { target: { value: 'Imprimir cartas' } })
    fireEvent.click(screen.getByLabelText('Mostrar como «tema más pedido» en el inicio'))
    fireEvent.click(screen.getByRole('button', { name: /Crear categoría/ }))

    fireEvent.click(await screen.findByRole('button', { name: /Cancelar/ }))

    expect(crearCategoria).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
})
