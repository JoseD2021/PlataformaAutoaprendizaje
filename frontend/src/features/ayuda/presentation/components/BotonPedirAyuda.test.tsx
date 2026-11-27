import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ContextoAyuda } from '../../domain/entities'
import { BotonPedirAyuda } from './BotonPedirAyuda'

const { pedirAyuda } = vi.hoisted(() => ({ pedirAyuda: vi.fn() }))

vi.mock('../../../../app/container', () => ({
  container: { pedirAyuda: { execute: pedirAyuda } },
}))

function respuesta(puesto: number | null) {
  return {
    id: 'h1',
    puesto,
    guiaId: null,
    guiaTitulo: null,
    paso: null,
    solicitante: null,
    creadaEn: '2026-11-26T15:00:00.000Z',
  }
}

function renderizar(contexto?: ContextoAyuda) {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <BotonPedirAyuda contexto={contexto} />
    </QueryClientProvider>,
  )
  fireEvent.click(screen.getByRole('button', { name: 'Pedir ayuda' }))
}

describe('BotonPedirAyuda', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    pedirAyuda.mockReset()
  })

  it('dentro de una guía envía la guía, el paso y el puesto, y confirma con el número', async () => {
    pedirAyuda.mockResolvedValue(respuesta(5))
    renderizar({ guiaId: 'enviar-correo-foto', guiaTitulo: 'Enviar un correo con una foto', paso: 2 })

    expect(screen.getByText('Enviar un correo con una foto')).toBeInTheDocument()
    expect(screen.getByText('paso 2')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Número de tu computador (opcional)'), {
      target: { value: '5' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Avisar a la asistente' }))

    expect(
      await screen.findByRole('heading', { name: '¡Listo! La asistente ya fue avisada' }),
    ).toBeInTheDocument()
    expect(screen.getByText('computador 5')).toBeInTheDocument()
    expect(pedirAyuda).toHaveBeenCalledWith({ puesto: 5, guiaId: 'enviar-correo-foto', paso: 2 })
  })

  it('el puesto es opcional', async () => {
    pedirAyuda.mockResolvedValue(respuesta(null))
    renderizar()

    fireEvent.click(screen.getByRole('button', { name: 'Avisar a la asistente' }))

    expect(await screen.findByText('Va a venir a ayudarte. Quédate donde estás.')).toBeInTheDocument()
    expect(pedirAyuda).toHaveBeenCalledWith({ puesto: undefined, guiaId: undefined, paso: undefined })
  })

  it('recuerda el puesto en el navegador y lo propone la próxima vez', async () => {
    pedirAyuda.mockResolvedValue(respuesta(7))
    renderizar()

    fireEvent.change(screen.getByLabelText('Número de tu computador (opcional)'), {
      target: { value: '7' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Avisar a la asistente' }))
    await screen.findByText('computador 7')

    expect(localStorage.getItem('clena:puesto')).toBe('7')
  })

  it('propone el puesto guardado al abrir el modal', () => {
    localStorage.setItem('clena:puesto', '3')
    renderizar()

    expect(screen.getByLabelText('Número de tu computador (opcional)')).toHaveValue(3)
  })

  it('muestra un error si no se pudo avisar', async () => {
    pedirAyuda.mockRejectedValue(new Error('sin red'))
    renderizar()

    fireEvent.click(screen.getByRole('button', { name: 'Avisar a la asistente' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Ocurrió un error')
  })
})
