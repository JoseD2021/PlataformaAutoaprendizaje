import type { DudasRepository } from '../domain/dudas-repository'

export class EliminarDuda {
  private readonly repo: DudasRepository

  constructor(repo: DudasRepository) {
    this.repo = repo
  }

  execute(id: string) {
    return this.repo.eliminar(id)
  }
}
