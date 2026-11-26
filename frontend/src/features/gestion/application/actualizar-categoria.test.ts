import { describe, expect, it, vi } from 'vitest'
import { ActualizarCategoria } from './actualizar-categoria'
import type { CategoriaGestion, DatosCategoria } from '../domain/entities'
import type { GestionRepository } from '../domain/gestion-repository'

const destacada: CategoriaGestion = {
  id: 'c1',
  nombre: 'Correo',
  icono: 'mail',
  descripcion: 'Enviar mensajes',
  esDestacada: true,
}

const datos: DatosCategoria = {
  nombre: 'Documentos',
  icono: 'file-text',
  descripcion: 'Imprimir cartas',
  esDestacada: true,
}

describe('ActualizarCategoria', () => {
  it('quita el destacado anterior antes de destacar la categoría editada', async () => {
    const listarCategorias = vi.fn().mockResolvedValue([destacada])
    const quitarDestacado = vi.fn().mockResolvedValue(undefined)
    const actualizarCategoria = vi.fn().mockResolvedValue(undefined)
    const repo = { listarCategorias, quitarDestacado, actualizarCategoria } as unknown as GestionRepository

    await new ActualizarCategoria(repo).execute('c2', datos)

    expect(quitarDestacado).toHaveBeenCalledWith('c1')
    expect(actualizarCategoria).toHaveBeenCalledWith('c2', datos)
    expect(quitarDestacado.mock.invocationCallOrder[0]).toBeLessThan(
      actualizarCategoria.mock.invocationCallOrder[0],
    )
  })

  it('no intenta desmarcar la categoría que se está editando', async () => {
    const listarCategorias = vi.fn().mockResolvedValue([{ ...destacada, id: 'c2' }])
    const quitarDestacado = vi.fn().mockResolvedValue(undefined)
    const actualizarCategoria = vi.fn().mockResolvedValue(undefined)
    const repo = { listarCategorias, quitarDestacado, actualizarCategoria } as unknown as GestionRepository

    await new ActualizarCategoria(repo).execute('c2', datos)

    expect(quitarDestacado).not.toHaveBeenCalled()
    expect(actualizarCategoria).toHaveBeenCalledWith('c2', datos)
  })

  it('no consulta el listado si se guarda sin destacar', async () => {
    const listarCategorias = vi.fn()
    const quitarDestacado = vi.fn()
    const actualizarCategoria = vi.fn().mockResolvedValue(undefined)
    const repo = { listarCategorias, quitarDestacado, actualizarCategoria } as unknown as GestionRepository

    await new ActualizarCategoria(repo).execute('c2', { ...datos, esDestacada: false })

    expect(listarCategorias).not.toHaveBeenCalled()
    expect(quitarDestacado).not.toHaveBeenCalled()
    expect(actualizarCategoria).toHaveBeenCalledWith('c2', { ...datos, esDestacada: false })
  })
})
