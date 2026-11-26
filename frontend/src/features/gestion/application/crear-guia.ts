import type { DatosGuia } from '../domain/entities'
import type { GestionRepository } from '../domain/gestion-repository'
import { quitarMasPedidaAnterior } from './mas-pedida'

export class CrearGuia {
  private readonly repo: GestionRepository

  constructor(repo: GestionRepository) {
    this.repo = repo
  }

  async execute(datos: DatosGuia): Promise<void> {
    if (datos.esMasPedida) {
      await quitarMasPedidaAnterior(this.repo, datos)
    }
    await this.repo.crearGuia(datos)
  }
}
