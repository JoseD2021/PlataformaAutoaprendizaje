import type { DatosCategoria } from '../domain/entities'
import type { GestionRepository } from '../domain/gestion-repository'

export class CrearCategoria {
  private readonly repo: GestionRepository

  constructor(repo: GestionRepository) {
    this.repo = repo
  }

  execute(datos: DatosCategoria) {
    return this.repo.crearCategoria(datos)
  }
}
