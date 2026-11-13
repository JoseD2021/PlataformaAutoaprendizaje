import type { DatosCategoria } from '../domain/entities'
import type { GestionRepository } from '../domain/gestion-repository'

export class ActualizarCategoria {
  private readonly repo: GestionRepository

  constructor(repo: GestionRepository) {
    this.repo = repo
  }

  execute(id: string, datos: DatosCategoria) {
    return this.repo.actualizarCategoria(id, datos)
  }
}
