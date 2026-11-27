import type { Permiso } from '../domain/permisos'
import type { RolesRepository } from '../domain/roles-repository'

export class ActualizarPermisosRol {
  private readonly repo: RolesRepository

  constructor(repo: RolesRepository) {
    this.repo = repo
  }

  execute(rol: string, permisos: Permiso[]) {
    return this.repo.actualizarPermisos(rol, permisos)
  }
}
