import type { AyudaRepository } from '../domain/ayuda-repository'

export class MarcarAyudaAtendida {
  private readonly repo: AyudaRepository

  constructor(repo: AyudaRepository) {
    this.repo = repo
  }

  execute(id: string) {
    return this.repo.marcarAtendida(id)
  }
}
