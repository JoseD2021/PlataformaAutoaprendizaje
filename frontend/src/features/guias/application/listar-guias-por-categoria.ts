import type { GuiasRepository } from '../domain/guias-repository'

export class ListarGuiasPorCategoria {
  private readonly repo: GuiasRepository

  constructor(repo: GuiasRepository) {
    this.repo = repo
  }

  execute(categoriaId: string) {
    return this.repo.listarGuiasPorCategoria(categoriaId)
  }
}