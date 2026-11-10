import type { AuthRepository } from '../domain/auth-repository'
import type { DatosRegistro } from '../domain/entities'

export class RegistrarUsuario {
  private readonly repo: AuthRepository

  constructor(repo: AuthRepository) {
    this.repo = repo
  }

  async execute(datos: DatosRegistro) {
    await this.repo.registrar(datos)
    return this.repo.iniciarSesion({ email: datos.email, password: datos.password })
  }
}
