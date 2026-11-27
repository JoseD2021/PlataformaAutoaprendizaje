import type { AuthRepository } from '../domain/auth-repository'

export class EliminarCuenta {
  private readonly repo: AuthRepository

  constructor(repo: AuthRepository) {
    this.repo = repo
  }

  execute(): Promise<void> {
    return this.repo.eliminarCuenta()
  }
}
