import { describe, expect, it, vi } from 'vitest'
import { CrearGuia } from './crear-guia'
import type { CategoriaGestion, DatosGuia, GuiaGestionResumen } from '../domain/entities'
import type { GestionRepository } from '../domain/gestion-repository'

const correo: CategoriaGestion = {
  id: 'cat-correo',
  nombre: 'Correo',
  slug: 'correo',
  icono: 'mail',
  descripcion: 'Enviar mensajes',
  esDestacada: false,
}

const datos: DatosGuia = {
  titulo: 'Enviar un correo',
  categoriaId: 'cat-correo',
  minutosEstimados: 3,
  esMasPedida: true,
  etiqueta: '',
  palabrasClave: '',
  pasos: [],
}

function guia(id: string, categoriaId: string, esMasPedida = true): GuiaGestionResumen {
  return {
    id,
    titulo: `Guía ${id}`,
    categoriaId,
    totalPasos: 2,
    minutosEstimados: 3,
    esMasPedida,
    estado: 'publicada',
  }
}

describe('CrearGuia', () => {
  it('quita la más pedida anterior de la misma categoría antes de crear', async () => {
    const anterior = guia('g1', 'correo')
    const otraCategoria = guia('g2', 'cat-tramites')
    const listarGuias = vi.fn().mockResolvedValue({
      items: [anterior, otraCategoria],
      total: 2,
      pagina: 1,
      limite: 100,
    })
    const listarCategorias = vi.fn().mockResolvedValue([
      correo,
      { ...correo, id: 'cat-tramites', slug: 'tramites', nombre: 'Trámites' },
    ])
    const quitarMasPedida = vi.fn().mockResolvedValue(undefined)
    const crearGuia = vi.fn().mockResolvedValue(undefined)
    const repo = {
      listarGuias,
      listarCategorias,
      quitarMasPedida,
      crearGuia,
    } as unknown as GestionRepository

    await new CrearGuia(repo).execute(datos)

    expect(quitarMasPedida).toHaveBeenCalledTimes(1)
    expect(quitarMasPedida).toHaveBeenCalledWith('g1')
    expect(crearGuia).toHaveBeenCalledWith(datos)
    expect(quitarMasPedida.mock.invocationCallOrder[0]).toBeLessThan(
      crearGuia.mock.invocationCallOrder[0],
    )
  })

  it('no consulta el listado si la guía nueva no es más pedida', async () => {
    const listarGuias = vi.fn()
    const quitarMasPedida = vi.fn()
    const crearGuia = vi.fn().mockResolvedValue(undefined)
    const repo = { listarGuias, quitarMasPedida, crearGuia } as unknown as GestionRepository

    await new CrearGuia(repo).execute({ ...datos, esMasPedida: false })

    expect(listarGuias).not.toHaveBeenCalled()
    expect(quitarMasPedida).not.toHaveBeenCalled()
    expect(crearGuia).toHaveBeenCalledWith({ ...datos, esMasPedida: false })
  })
})
