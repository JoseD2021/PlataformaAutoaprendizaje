import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import type { CategoriaDuda, Duda } from '../../domain/entities'
import { DudasSinGuiaPanel } from './DudasSinGuiaPanel'

const estado = vi.hoisted(() => ({
  dudas: [] as Duda[],
  categorias: [] as CategoriaDuda[],
  anotar: vi.fn(),
  eliminar: vi.fn(),
}))

vi.mock('../hooks/useDudas', () => ({
  useDudas: () => ({ data: estado.dudas, isLoading: false, isError: false }),
  useCategoriasDudas: () => ({
    data: estado.categorias,
    isLoading: false,
    isError: false,
  }),
  useAnotarDuda: () => ({ mutateAsync: estado.anotar, isPending: false }),
  useEliminarDuda: () => ({ mutateAsync: estado.eliminar, isPending: false }),
}))

function duda(id: string, texto: string, veces: number): Duda {
  return {
    id,
    duda: texto,
    tema: 'Correo',
    veces,
    ultimaVez: '2026-11-26T10:00:00.000Z',
  }
}

function filas() {
  return within(screen.getByRole('table'))
    .getAllByRole('row')
    .slice(1)
    .map((fila) => within(fila).getAllByRole('cell').map((celda) => celda.textContent))
}

beforeEach(() => {
  estado.dudas = []
  estado.categorias = [{ id: 'cat-1', nombre: 'Correo' }]
  estado.anotar.mockReset()
  estado.eliminar.mockReset()
})

describe('DudasSinGuiaPanel', () => {
  it('muestra primero las más preguntadas y permite ordenar por duda', () => {
    estado.dudas = [
      duda('a', '¿Cómo envío un correo?', 1),
      duda('b', '¿Dónde está mi foto?', 5),
      duda('c', '¿Cómo adjunto un archivo?', 2),
    ]

    render(<DudasSinGuiaPanel />)

    expect(filas().map((fila) => fila[0])).toEqual([
      '¿Dónde está mi foto?',
      '¿Cómo adjunto un archivo?',
      '¿Cómo envío un correo?',
    ])

    fireEvent.click(screen.getByRole('button', { name: /^Duda/ }))

    expect(filas().map((fila) => fila[0])).toEqual([
      '¿Cómo adjunto un archivo?',
      '¿Cómo envío un correo?',
      '¿Dónde está mi foto?',
    ])
    expect(screen.getByRole('columnheader', { name: /^Duda/ })).toHaveAttribute(
      'aria-sort',
      'ascending',
    )
  })

  it('anota una duda con el tema elegido y avisa si ya estaba registrada', async () => {
    estado.anotar.mockResolvedValue({
      ...duda('b', '¿Cómo envío un correo?', 2),
    })

    render(<DudasSinGuiaPanel />)

    fireEvent.change(screen.getByLabelText('Duda'), {
      target: { value: '¿Cómo envío un correo?' },
    })
    fireEvent.change(screen.getByLabelText('Tema'), { target: { value: 'cat-1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Anotar duda' }))

    await waitFor(() => {
      expect(estado.anotar).toHaveBeenCalledWith({
        duda: '¿Cómo envío un correo?',
        categoriaId: 'cat-1',
      })
    })
    expect(screen.getByText(/ya estaba anotada/)).toHaveTextContent(
      'Ahora lleva 2 veces.',
    )
  })

  it('elimina la duda de la fila después de confirmar', async () => {
    estado.dudas = [duda('a', '¿Cómo envío un correo?', 2)]
    estado.eliminar.mockResolvedValue(undefined)
    const confirmar = vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<DudasSinGuiaPanel />)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Eliminar duda: ¿Cómo envío un correo?',
      }),
    )

    await waitFor(() => {
      expect(estado.eliminar).toHaveBeenCalledWith('a')
    })
    expect(screen.getByText('Duda eliminada.')).toBeInTheDocument()
    confirmar.mockRestore()
  })

  it('no elimina nada si se cancela la confirmación', () => {
    estado.dudas = [duda('a', '¿Cómo envío un correo?', 2)]
    const confirmar = vi.spyOn(window, 'confirm').mockReturnValue(false)

    render(<DudasSinGuiaPanel />)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Eliminar duda: ¿Cómo envío un correo?',
      }),
    )

    expect(estado.eliminar).not.toHaveBeenCalled()
    confirmar.mockRestore()
  })
})
