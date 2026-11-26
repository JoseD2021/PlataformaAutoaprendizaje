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

  it('no consulta ni muestra nada a un usuario común o sin sesión', () => {
    usuarioActual.value = usuario('usuario')
    renderizar()

    expect(screen.queryByRole('region', { name: 'Solicitudes de ayuda' })).not.toBeInTheDocument()
    expect(listarPendientes).not.toHaveBeenCalled()
  })
})
