import type { SalaRepository } from '../domain/sala-repository'

export class ObtenerInformacionSala {
  private readonly repo: SalaRepository

  constructor(repo: SalaRepository) {
    this.repo = repo
  }

  execute() {
    return this.repo.obtenerInformacion()
  }
}