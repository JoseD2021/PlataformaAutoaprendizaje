import type { Credenciales, DatosRegistro, SesionIniciada, Usuario } from './entities'

export interface AuthRepository {
  iniciarSesion(credenciales: Credenciales): Promise<SesionIniciada>
  registrar(datos: DatosRegistro): Promise<Usuario>
  cerrarSesion(refreshToken: string): Promise<void>
  obtenerPerfil(): Promise<Usuario>
}
