import type { EstadoGuia } from '../domain/entities'
import type { GestionRepository } from '../domain/gestion-repository'

export class CambiarEstadoGuia {
  private readonly repo: GestionRepository

  constructor(repo: GestionRepository) {
    this.repo = repo
  }

  execute(id: string, estado: EstadoGuia) {
    return this.repo.cambiarEstadoGuia(id, estado)
  }
}
