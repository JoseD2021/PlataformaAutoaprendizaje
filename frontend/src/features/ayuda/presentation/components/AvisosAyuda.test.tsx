import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Usuario } from '../../../auth/domain/entities'
import { AvisosAyuda } from './AvisosAyuda'

const { usuarioActual, listarPendientes, marcarAtendida } = vi.hoisted(() => ({
  usuarioActual: { value: null as Usuario | null },
  listarPendientes: vi.fn(),
  marcarAtendida: vi.fn(),
}))

vi.mock('../../../auth/presentation/context/AuthContext', () => ({
  useAuth: () => ({ usuario: usuarioActual.value }),
}))

vi.mock('../../../../app/container', () => ({
  container: {
    listarAyudasPendientes: { execute: listarPendientes },
    marcarAyudaAtendida: { execute: marcarAtendida },
  },
}))

const solicitud = {
  id: 'h1',
  puesto: 5,
  guiaId: 'enviar-correo-foto',
  guiaTitulo: 'Enviar un correo con una foto',
  paso: 2,
  solicitante: 'Ana Pérez',
  creadaEn: '2026-11-26T15:00:00.000Z',
}

function haceMinutos(minutos: number) {
  return new Date(Date.now() - minutos * 60_000).toISOString()
}

function usuario(rol: Usuario['rol']): Usuario {
  return { id: 'u1', email: 'x@clena.local', nombreCompleto: 'Luis Gómez', rol, activo: true }
}

function renderizar() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <AvisosAyuda />
    </QueryClientProvider>,
  )
  return { client }
}

describe('AvisosAyuda', () => {
  afterEach(() => {
    usuarioActual.value = null
    listarPendientes.mockReset()
    marcarAtendida.mockReset()
  })

  it.each(['personal_clena', 'administrador'] as const)(
    'al rol %s le muestra el puesto, la guía, el paso y el nombre',
    async (rol) => {
      usuarioActual.value = usuario(rol)
      listarPendientes.mockResolvedValue([solicitud])
      renderizar()

      expect(await screen.findByText('Alguien está pidiendo ayuda')).toBeInTheDocument()
      expect(screen.getByText('Puesto 5')).toBeInTheDocument()
      expect(screen.getByText('Ana Pérez')).toBeInTheDocument()
      expect(screen.getByText('Enviar un correo con una foto · paso 2')).toBeInTheDocument()
    },
  )

  it('si no tiene sesión ni puesto lo indica', async () => {
    usuarioActual.value = usuario('personal_clena')
    listarPendientes.mockResolvedValue([
      { ...solicitud, puesto: null, solicitante: null, guiaTitulo: null, paso: null },
    ])
    renderizar()

    expect(await screen.findByText('Puesto sin indicar')).toBeInTheDocument()
    expect(screen.getByText('Visitante sin cuenta')).toBeInTheDocument()
  })

  it('el botón Atendida marca la solicitud y vuelve a consultar', async () => {
    usuarioActual.value = usuario('personal_clena')
    listarPendientes.mockResolvedValueOnce([solicitud]).mockResolvedValue([])
    marcarAtendida.mockResolvedValue(undefined)
    renderizar()

    fireEvent.click(await screen.findByRole('button', { name: 'Marcar como atendida: Puesto 5' }))

    await waitFor(() => expect(screen.queryByText('Puesto 5')).not.toBeInTheDocument())
    expect(marcarAtendida).toHaveBeenCalledWith('h1')
  })

  it('muestra como máximo 3 tarjetas y un botón para ver las demás', async () => {
    usuarioActual.value = usuario('personal_clena')
    listarPendientes.mockResolvedValue(
      [1, 2, 3, 4, 5].map((n) => ({ ...solicitud, id: `h${n}`, puesto: n })),
    )
    renderizar()

    expect(await screen.findByText('5 personas están pidiendo ayuda')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)

    fireEvent.click(screen.getByRole('button', { name: 'Ver 2 más' }))

    expect(screen.getAllByRole('listitem')).toHaveLength(5)
  })

  it('se puede minimizar y se vuelve a abrir solo si llega una solicitud nueva', async () => {
    usuarioActual.value = usuario('personal_clena')
    listarPendientes.mockResolvedValue([solicitud])
    const { client } = renderizar()

    fireEvent.click(await screen.findByRole('button', { name: 'Minimizar' }))

    expect(screen.queryByText('Puesto 5')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Mostrar solicitudes/ })).toHaveTextContent(
      '1 pidiendo ayuda',
    )

    listarPendientes.mockResolvedValue([solicitud, { ...solicitud, id: 'h2', puesto: 8 }])
    await client.refetchQueries()

    expect(await screen.findByText('Puesto 8')).toBeInTheDocument()
  })

  it('resalta las solicitudes que llevan 5 minutos o más esperando', async () => {
    usuarioActual.value = usuario('personal_clena')
    listarPendientes.mockResolvedValue([
      { ...solicitud, id: 'vieja', puesto: 1, creadaEn: haceMinutos(12) },
      { ...solicitud, id: 'nueva', puesto: 2, creadaEn: haceMinutos(2) },
    ])
    renderizar()

    expect(await screen.findByText('Lleva 12 min esperando')).toBeInTheDocument()
    expect(screen.getByText(/hace 2 min/)).toBeInTheDocument()
    const [vieja, nueva] = screen.getAllByRole('listitem')
    expect(vieja).toHaveClass('aviso-ayuda--demorada')
    expect(nueva).not.toHaveClass('aviso-ayuda--demorada')
  })

  it('no consulta ni muestra nada a un usuario común o sin sesión', () => {
    usuarioActual.value = usuario('usuario')
    renderizar()

    expect(screen.queryByRole('region', { name: 'Solicitudes de ayuda' })).not.toBeInTheDocument()
    expect(listarPendientes).not.toHaveBeenCalled()
  })
})
