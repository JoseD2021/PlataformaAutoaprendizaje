import type { AdminRepository } from '../domain/admin-repository'

export class ListarRoles {
  private readonly repo: AdminRepository

  constructor(repo: AdminRepository) {
    this.repo = repo
  }

  execute() {
    return this.repo.listarRoles()
  }
}