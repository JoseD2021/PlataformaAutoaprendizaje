import type { DatosGuia } from '../domain/entities'
import type { GestionRepository } from '../domain/gestion-repository'

export class ActualizarGuia {
  private readonly repo: GestionRepository

  constructor(repo: GestionRepository) {
    this.repo = repo
  }

  execute(id: string, datos: DatosGuia) {
    return this.repo.actualizarGuia(id, datos)
  }
}
