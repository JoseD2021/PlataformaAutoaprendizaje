import type { GestionRepository } from '../domain/gestion-repository'

export class ListarCategoriasGestion {
  private readonly repo: GestionRepository

  constructor(repo: GestionRepository) {
    this.repo = repo
  }

  execute() {
    return this.repo.listarCategorias()
  }
}
