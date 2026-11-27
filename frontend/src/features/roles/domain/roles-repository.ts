import type { DatosNuevoRol, RolDetalle } from './entities'
import type { Permiso } from './permisos'

export interface RolesRepository {
  listar(): Promise<RolDetalle[]>
  crear(datos: DatosNuevoRol): Promise<RolDetalle>
  actualizarPermisos(rol: string, permisos: Permiso[]): Promise<RolDetalle>
  eliminar(rol: string): Promise<void>
}
