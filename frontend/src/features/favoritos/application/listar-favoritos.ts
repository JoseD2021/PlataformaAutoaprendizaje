import type { FavoritosRepository } from '../domain/favoritos-repository'

export class ListarFavoritos {
  private readonly repo: FavoritosRepository

  constructor(repo: FavoritosRepository) {
    this.repo = repo
  }

  execute(usuarioId: string) {
    return this.repo.listar(usuarioId)
  }
}