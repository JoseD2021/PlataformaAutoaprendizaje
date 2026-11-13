import type { GestionRepository } from '../domain/gestion-repository'

export class EliminarCategoria {
  private readonly repo: GestionRepository

  constructor(repo: GestionRepository) {
    this.repo = repo
  }

  execute(id: string) {
    return this.repo.eliminarCategoria(id)
  }
}
