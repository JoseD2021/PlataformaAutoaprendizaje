import type { GuiasRepository } from '../domain/guias-repository'

export class ListarCategorias {
  private readonly repo: GuiasRepository

  constructor(repo: GuiasRepository) {
    this.repo = repo
  }

  execute() {
    return this.repo.listarCategorias()
  }
}