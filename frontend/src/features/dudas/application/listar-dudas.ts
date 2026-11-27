import type { DudasRepository } from '../domain/dudas-repository'

export class ListarDudas {
  private readonly repo: DudasRepository

  constructor(repo: DudasRepository) {
    this.repo = repo
  }

  execute() {
    return this.repo.listar()
  }
}
