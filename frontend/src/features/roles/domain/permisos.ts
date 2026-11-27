import { PERMISOS } from '../../../shared/permisos'

export {
  PERMISOS,
  PERMISOS_GESTION,
  RANGO_MINIMO_POR_PERMISO,
  permisosPorRango,
  tieneAlgunPermiso,
  tienePermiso,
  tieneTodosLosPermisos,
} from '../../../shared/permisos'
export type { Permiso } from '../../../shared/permisos'

export const GRUPOS_PERMISOS = [...new Set(PERMISOS.map((permiso) => permiso.grupo))]
