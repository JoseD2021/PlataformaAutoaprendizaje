import type { DatosNuevoRol } from '../domain/entities'
import type { RolesRepository } from '../domain/roles-repository'

export class CrearRol {
  private readonly repo: RolesRepository

  constructor(repo: RolesRepository) {
    this.repo = repo
  }

  execute(datos: DatosNuevoRol) {
    return this.repo.crear(datos)
  }
}
