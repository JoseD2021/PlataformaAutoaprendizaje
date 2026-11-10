import type { AuthRepository } from '../domain/auth-repository'

export class CerrarSesion {
  private readonly repo: AuthRepository

  constructor(repo: AuthRepository) {
    this.repo = repo
  }

  execute(refreshToken: string) {
    return this.repo.cerrarSesion(refreshToken)
  }
}
