import type { AuthRepository } from '../domain/auth-repository'

export class AceptarTerminosPrivacidad {
  private readonly repo: AuthRepository

  constructor(repo: AuthRepository) {
    this.repo = repo
  }

  execute(version: string) {
    return this.repo.aceptarTerminosPrivacidad(version)
  }
}
