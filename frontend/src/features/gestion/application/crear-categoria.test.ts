import { describe, expect, it, vi } from 'vitest'
import { CrearCategoria } from './crear-categoria'
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

describe('CrearCategoria', () => {
  it('quita el destacado anterior antes de crear la nueva categoría destacada', async () => {
    const listarCategorias = vi.fn().mockResolvedValue([destacada])
    const quitarDestacado = vi.fn().mockResolvedValue(undefined)
    const crearCategoria = vi.fn().mockResolvedValue(undefined)
    const repo = { listarCategorias, quitarDestacado, crearCategoria } as unknown as GestionRepository

    await new CrearCategoria(repo).execute(datos)

    expect(quitarDestacado).toHaveBeenCalledWith('c1')
    expect(crearCategoria).toHaveBeenCalledWith(datos)
    expect(quitarDestacado.mock.invocationCallOrder[0]).toBeLessThan(
      crearCategoria.mock.invocationCallOrder[0],
    )
  })

  it('quita todas las destacadas si había más de una', async () => {
    const otra: CategoriaGestion = { ...destacada, id: 'c2', nombre: 'Trámites' }
    const listarCategorias = vi.fn().mockResolvedValue([destacada, otra])
    const quitarDestacado = vi.fn().mockResolvedValue(undefined)
    const crearCategoria = vi.fn().mockResolvedValue(undefined)
    const repo = { listarCategorias, quitarDestacado, crearCategoria } as unknown as GestionRepository

    await new CrearCategoria(repo).execute(datos)

    expect(quitarDestacado).toHaveBeenCalledTimes(2)
    expect(quitarDestacado).toHaveBeenCalledWith('c1')
    expect(quitarDestacado).toHaveBeenCalledWith('c2')
  })

  it('no desmarca nada si la categoría nueva no es destacada', async () => {
    const listarCategorias = vi.fn()
    const quitarDestacado = vi.fn()
    const crearCategoria = vi.fn().mockResolvedValue(undefined)
    const repo = { listarCategorias, quitarDestacado, crearCategoria } as unknown as GestionRepository

    await new CrearCategoria(repo).execute({ ...datos, esDestacada: false })

    expect(listarCategorias).not.toHaveBeenCalled()
    expect(quitarDestacado).not.toHaveBeenCalled()
    expect(crearCategoria).toHaveBeenCalledWith({ ...datos, esDestacada: false })
  })
})
