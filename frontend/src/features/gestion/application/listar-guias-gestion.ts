import type { GestionRepository } from '../domain/gestion-repository'

export class ListarGuiasGestion {
  private readonly repo: GestionRepository

  constructor(repo: GestionRepository) {
    this.repo = repo
  }

  execute(pagina: number, limite: number) {
    return this.repo.listarGuias(pagina, limite)
  }
}
