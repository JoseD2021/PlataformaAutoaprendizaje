import type { AuthRepository } from '../domain/auth-repository'

export class CambiarNombre {
  private readonly repo: AuthRepository

  constructor(repo: AuthRepository) {
    this.repo = repo
  }

  execute(nombreCompleto: string): Promise<void> {
    return this.repo.cambiarNombre(nombreCompleto)
  }
}
