import type { Rol } from '../../auth/domain/entities'
import type { PaginaUsuarios, RolInfo } from './entities'

export interface AdminRepository {
  listarUsuarios(pagina: number, limite: number): Promise<PaginaUsuarios>
  cambiarRol(usuarioId: string, rol: Rol): Promise<void>
  listarRoles(): Promise<RolInfo[]>
}