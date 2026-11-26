import type { TerminosPrivacidad } from '../domain/entities'
import type { PrivacidadRepository } from '../domain/privacidad-repository'

export class ActualizarTerminosPrivacidad {
  private readonly repo: PrivacidadRepository

  constructor(repo: PrivacidadRepository) {
    this.repo = repo
  }

  execute(datos: TerminosPrivacidad) {
    return this.repo.actualizarTerminos(datos)
  }
}
