import type { RolesRepository } from '../domain/roles-repository'

export class ListarRolesDetalle {
  private readonly repo: RolesRepository

  constructor(repo: RolesRepository) {
    this.repo = repo
  }

  execute() {
    return this.repo.listar()
  }
}
