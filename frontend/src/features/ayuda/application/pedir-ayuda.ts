import type { AyudaRepository } from '../domain/ayuda-repository'
import type { NuevaSolicitudAyuda } from '../domain/entities'

export class PedirAyuda {
  private readonly repo: AyudaRepository

  constructor(repo: AyudaRepository) {
    this.repo = repo
  }

  execute(solicitud: NuevaSolicitudAyuda) {
    return this.repo.pedir(solicitud)
  }
}
