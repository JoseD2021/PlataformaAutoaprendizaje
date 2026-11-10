import type { AuthRepository } from '../domain/auth-repository'
import type { Credenciales } from '../domain/entities'

export class IniciarSesion {
  private readonly repo: AuthRepository

  constructor(repo: AuthRepository) {
    this.repo = repo
  }

  execute(credenciales: Credenciales) {
    return this.repo.iniciarSesion(credenciales)
  }
}
