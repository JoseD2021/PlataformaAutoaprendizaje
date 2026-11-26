import type { InformacionSala } from '../domain/entities'
import type { SalaRepository } from '../domain/sala-repository'

export class ActualizarInformacionSala {
  private readonly repo: SalaRepository

  constructor(repo: SalaRepository) {
    this.repo = repo
  }

  execute(datos: InformacionSala) {
    return this.repo.actualizarInformacion(datos)
  }
}
