import type { AuthRepository } from '../domain/auth-repository'

export class ObtenerPerfil {
  private readonly repo: AuthRepository

  constructor(repo: AuthRepository) {
    this.repo = repo
  }

  execute() {
    return this.repo.obtenerPerfil()
  }
}
