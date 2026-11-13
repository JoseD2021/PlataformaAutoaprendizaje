import type { Rol } from '../../auth/domain/entities'
import type { AdminRepository } from '../domain/admin-repository'

export class CambiarRolUsuario {
  private readonly repo: AdminRepository

  constructor(repo: AdminRepository) {
    this.repo = repo
  }

  execute(usuarioId: string, rol: Rol) {
    return this.repo.cambiarRol(usuarioId, rol)
  }
}