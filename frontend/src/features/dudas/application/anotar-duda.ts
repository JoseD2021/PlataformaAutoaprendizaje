import type { DudasRepository } from '../domain/dudas-repository'
import type { NuevaDuda } from '../domain/entities'

export class AnotarDuda {
  private readonly repo: DudasRepository

  constructor(repo: DudasRepository) {
    this.repo = repo
  }

  execute(nueva: NuevaDuda) {
    return this.repo.anotar(nueva)
  }
}
