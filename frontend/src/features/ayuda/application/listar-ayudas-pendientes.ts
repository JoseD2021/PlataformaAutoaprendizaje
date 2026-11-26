import type { AyudaRepository } from '../domain/ayuda-repository'

export class ListarAyudasPendientes {
  private readonly repo: AyudaRepository

  constructor(repo: AyudaRepository) {
    this.repo = repo
  }

  execute() {
    return this.repo.listarPendientes()
  }
}
