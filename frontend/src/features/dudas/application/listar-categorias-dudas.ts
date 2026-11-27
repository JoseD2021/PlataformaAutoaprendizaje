import type { DudasRepository } from '../domain/dudas-repository'

export class ListarCategoriasDudas {
  private readonly repo: DudasRepository

  constructor(repo: DudasRepository) {
    this.repo = repo
  }

  execute() {
    return this.repo.listarCategorias()
  }
}
