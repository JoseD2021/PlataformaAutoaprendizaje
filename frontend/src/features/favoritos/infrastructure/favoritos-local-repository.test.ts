import { beforeEach, describe, expect, it } from 'vitest'
import { FavoritosLocalRepository } from './favoritos-local-repository'

const guia = { guiaId: 'g1', titulo: 'Enviar foto', minutosEstimados: 3, totalPasos: 4 }

describe('FavoritosLocalRepository', () => {
  beforeEach(() => localStorage.clear())

  it('agrega sin duplicar y quita', async () => {
    const repo = new FavoritosLocalRepository()
    await repo.agregar('u1', guia)
    await repo.agregar('u1', guia)
    expect(await repo.listar('u1')).toHaveLength(1)
    await repo.quitar('u1', 'g1')
    expect(await repo.listar('u1')).toEqual([])
  })

  it('separa los favoritos por usuario', async () => {
    const repo = new FavoritosLocalRepository()
    await repo.agregar('u1', guia)
    expect(await repo.listar('u2')).toEqual([])
  })
})