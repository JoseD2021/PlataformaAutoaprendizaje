import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { container } from '../../../../app/container'
import { AuthProvider } from '../../../auth/presentation/context/AuthContext'
import { GuiaFormPage } from './GuiaFormPage'

const { navegar, params } = vi.hoisted(() => ({
  navegar: vi.fn(),
  params: { id: undefined as string | undefined },
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => navegar, useParams: () => params }
})

function renderizar() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <AuthProvider>
        <MemoryRouter>
          <GuiaFormPage />
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>,
  )
}

function espiarDatos() {
  vi.spyOn(container.listarGuiasGestion, 'execute').mockResolvedValue({
    items: [
      {
        id: 'g1',
        titulo: 'Enviar correo',
        categoriaId: 'correo',
        totalPasos: 2,
        minutosEstimados: 3,
        esMasPedida: true,
        estado: 'publicada',
      },
    ],
    total: 1,
    pagina: 1,
    limite: 100,
  })
  vi.spyOn(container.listarCategoriasGestion, 'execute').mockResolvedValue([
    {
      id: 'cat-correo',
      nombre: 'Correo',
      slug: 'correo',
      icono: 'mail',
      descripcion: 'Enviar mensajes',
      esDestacada: false,
    },
  ])
  return vi.spyOn(container.crearGuia, 'execute').mockResolvedValue(undefined)
}

function completarFormulario() {
  fireEvent.change(screen.getByLabelText('Título de la guía'), { target: { value: 'Nueva guía' } })
  fireEvent.change(screen.getByLabelText('Categoría'), { target: { value: 'cat-correo' } })
  fireEvent.change(screen.getByLabelText('Minutos estimados'), { target: { value: '4' } })
  fireEvent.click(screen.getByLabelText('Marcar como «La más pedida»'))
  fireEvent.submit(document.querySelector('form.gestion-form')!)
}

describe('GuiaFormPage', () => {
  afterEach(() => {
    params.id = undefined
    navegar.mockClear()
    vi.restoreAllMocks()
  })

  it('avisa antes de quitar la marca de más pedida a otra guía de la misma categoría', async () => {
    const crearGuia = espiarDatos()
    renderizar()
    await screen.findByLabelText('Título de la guía')

    completarFormulario()

    const dialogo = await screen.findByRole('dialog')
    expect(dialogo).toHaveAttribute('open')
    expect(screen.getByText(/Se quitará la marca «La más pedida» de/)).toHaveTextContent(
      'Enviar correo',
    )
    expect(crearGuia).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: /Continuar/ }))

    await waitFor(() => {
      expect(crearGuia).toHaveBeenCalledWith(
        expect.objectContaining({ titulo: 'Nueva guía', categoriaId: 'cat-correo', esMasPedida: true }),
      )
    })
    expect(navegar).toHaveBeenCalledWith('/gestion')
  })

  it('no guarda si se cancela el aviso', async () => {
    const crearGuia = espiarDatos()
    renderizar()
    await screen.findByLabelText('Título de la guía')

    completarFormulario()
    fireEvent.click(await screen.findByRole('button', { name: /Cancelar/ }))

    expect(crearGuia).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
})
