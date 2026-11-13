import type { AdminRepository } from '../domain/admin-repository'

export class ListarUsuarios {
  private readonly repo: AdminRepository

  constructor(repo: AdminRepository) {
    this.repo = repo
  }

  execute(pagina: number, limite: number) {
    return this.repo.listarUsuarios(pagina, limite)
  }
}