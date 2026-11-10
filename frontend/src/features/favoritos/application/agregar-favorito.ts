import type { Favorito } from '../domain/entities'
import type { FavoritosRepository } from '../domain/favoritos-repository'

export class AgregarFavorito {
  private readonly repo: FavoritosRepository

  constructor(repo: FavoritosRepository) {
    this.repo = repo
  }

  execute(usuarioId: string, favorito: Favorito) {
    return this.repo.agregar(usuarioId, favorito)
  }
}