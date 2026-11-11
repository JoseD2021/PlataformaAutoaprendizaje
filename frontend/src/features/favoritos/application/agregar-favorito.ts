import type { FavoritosRepository } from '../domain/favoritos-repository'

export class AgregarFavorito {
  private readonly repo: FavoritosRepository

  constructor(repo: FavoritosRepository) {
    this.repo = repo
  }

  execute(guiaId: string) {
    return this.repo.agregar(guiaId)
  }
}
