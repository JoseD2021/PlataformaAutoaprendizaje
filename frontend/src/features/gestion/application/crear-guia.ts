import type { DatosGuia } from '../domain/entities'
import type { GestionRepository } from '../domain/gestion-repository'

export class CrearGuia {
  private readonly repo: GestionRepository

  constructor(repo: GestionRepository) {
    this.repo = repo
  }

  execute(datos: DatosGuia) {
    return this.repo.crearGuia(datos)
  }
}
