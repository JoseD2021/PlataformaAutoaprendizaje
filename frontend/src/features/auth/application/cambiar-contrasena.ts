import type { AuthRepository } from '../domain/auth-repository'

export class CambiarContrasena {
  private readonly repo: AuthRepository

  constructor(repo: AuthRepository) {
    this.repo = repo
  }

  execute(contrasenaActual: string, contrasenaNueva: string): Promise<void> {
    return this.repo.cambiarContrasena(contrasenaActual, contrasenaNueva)
  }
}
