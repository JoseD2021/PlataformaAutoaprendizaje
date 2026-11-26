import { describe, expect, it, vi } from 'vitest'
import { ActualizarGuia } from './actualizar-guia'
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

describe('ActualizarGuia', () => {
  it('quita la más pedida anterior de la misma categoría sin desmarcar la guía editada', async () => {
    const listarGuias = vi.fn().mockResolvedValue({
      items: [
        guia('g-actual', 'correo'),
        guia('g1', 'correo'),
        guia('g2', 'cat-tramites'),
      ],
      total: 3,
      pagina: 1,
      limite: 100,
    })
    const listarCategorias = vi.fn().mockResolvedValue([
      correo,
      { ...correo, id: 'cat-tramites', slug: 'tramites', nombre: 'Trámites' },
    ])
    const quitarMasPedida = vi.fn().mockResolvedValue(undefined)
    const actualizarGuia = vi.fn().mockResolvedValue(undefined)
    const repo = {
      listarGuias,
      listarCategorias,
      quitarMasPedida,
      actualizarGuia,
    } as unknown as GestionRepository

    await new ActualizarGuia(repo).execute('g-actual', datos)

    expect(quitarMasPedida).toHaveBeenCalledTimes(1)
    expect(quitarMasPedida).toHaveBeenCalledWith('g1')
    expect(actualizarGuia).toHaveBeenCalledWith('g-actual', datos)
    expect(quitarMasPedida.mock.invocationCallOrder[0]).toBeLessThan(
      actualizarGuia.mock.invocationCallOrder[0],
    )
  })

  it('no desmarca nada si la guía no es más pedida', async () => {
    const listarGuias = vi.fn()
    const quitarMasPedida = vi.fn()
    const actualizarGuia = vi.fn().mockResolvedValue(undefined)
    const repo = { listarGuias, quitarMasPedida, actualizarGuia } as unknown as GestionRepository

    await new ActualizarGuia(repo).execute('g-actual', { ...datos, esMasPedida: false })

    expect(listarGuias).not.toHaveBeenCalled()
    expect(quitarMasPedida).not.toHaveBeenCalled()
    expect(actualizarGuia).toHaveBeenCalledWith('g-actual', { ...datos, esMasPedida: false })
  })
})
