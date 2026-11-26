import type { DatosGuia } from '../domain/entities'
import type { GestionRepository } from '../domain/gestion-repository'
import { quitarMasPedidaAnterior } from './mas-pedida'

export class ActualizarGuia {
  private readonly repo: GestionRepository

  constructor(repo: GestionRepository) {
    this.repo = repo
  }

  async execute(id: string, datos: DatosGuia): Promise<void> {
    if (datos.esMasPedida) {
      await quitarMasPedidaAnterior(this.repo, datos, id)
    }
    await this.repo.actualizarGuia(id, datos)
  }
}
