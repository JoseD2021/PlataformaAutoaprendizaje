import type { FavoritosRepository } from '../domain/favoritos-repository'

export class ListarFavoritos {
  private readonly repo: FavoritosRepository

  constructor(repo: FavoritosRepository) {
    this.repo = repo
  }

  execute() {
    return this.repo.listar()
  }
}
