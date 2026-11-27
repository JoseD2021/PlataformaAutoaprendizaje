import type { RolesRepository } from '../domain/roles-repository'

export class EliminarRol {
  private readonly repo: RolesRepository

  constructor(repo: RolesRepository) {
    this.repo = repo
  }

  execute(rol: string) {
    return this.repo.eliminar(rol)
  }
}
