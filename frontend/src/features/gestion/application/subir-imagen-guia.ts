import type { GestionRepository } from '../domain/gestion-repository'

export class SubirImagenGuia {
  private readonly repo: GestionRepository

  constructor(repo: GestionRepository) {
    this.repo = repo
  }

  execute(archivo: File) {
    return this.repo.subirImagen(archivo)
  }
}
