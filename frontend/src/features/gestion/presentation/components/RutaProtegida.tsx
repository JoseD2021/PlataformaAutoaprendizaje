import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import {
  tieneAlgunPermiso,
  tieneTodosLosPermisos,
  type Permiso,
} from '../../../../shared/permisos'
import { useAuth } from '../../../auth/presentation/context/AuthContext'

export function RutaProtegida({
  permisos = [],
  todos = false,
  children,
}: {
  permisos?: Permiso[]
  todos?: boolean
  children: ReactNode
}) {
  const { usuario, cargando } = useAuth()

  if (cargando) return <p role="status">Verificando tu sesión…</p>
  if (!usuario) return <Navigate to="/login" replace />
  if (permisos.length > 0) {
    const autorizado = todos
      ? tieneTodosLosPermisos(usuario, permisos)
      : tieneAlgunPermiso(usuario, permisos)
    if (!autorizado) return <Navigate to="/" replace />
  }

  return <>{children}</>
}
