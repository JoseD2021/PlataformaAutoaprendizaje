import type { FavoritosRepository } from '../domain/favoritos-repository'

export class QuitarFavorito {
  private readonly repo: FavoritosRepository

  constructor(repo: FavoritosRepository) {
    this.repo = repo
  }

  execute(usuarioId: string, guiaId: string) {
    return this.repo.quitar(usuarioId, guiaId)
  }
}