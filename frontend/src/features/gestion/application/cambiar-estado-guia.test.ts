import { describe, expect, it, vi } from 'vitest'
import { CambiarEstadoGuia } from './cambiar-estado-guia'
import type { GestionRepository } from '../domain/gestion-repository'

describe('CambiarEstadoGuia', () => {
  it('pide al repositorio publicar la guía indicada', async () => {
    const cambiarEstadoGuia = vi.fn().mockResolvedValue(undefined)
    const repo = { cambiarEstadoGuia } as unknown as GestionRepository

    await new CambiarEstadoGuia(repo).execute('enviar-correo-foto', 'publicada')

    expect(cambiarEstadoGuia).toHaveBeenCalledWith('enviar-correo-foto', 'publicada')
  })

  it('permite devolver una guía a borrador', async () => {
    const cambiarEstadoGuia = vi.fn().mockResolvedValue(undefined)
    const repo = { cambiarEstadoGuia } as unknown as GestionRepository

    await new CambiarEstadoGuia(repo).execute('g1', 'borrador')

    expect(cambiarEstadoGuia).toHaveBeenCalledWith('g1', 'borrador')
  })
})
