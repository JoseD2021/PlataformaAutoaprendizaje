import type { PrivacidadRepository } from '../domain/privacidad-repository'

export class ObtenerTerminosPrivacidad {
  private readonly repo: PrivacidadRepository

  constructor(repo: PrivacidadRepository) {
    this.repo = repo
  }

  execute() {
    return this.repo.obtenerTerminos()
  }
}
