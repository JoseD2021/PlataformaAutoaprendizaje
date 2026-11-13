import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import type { Rol } from '../../../auth/domain/entities'
import { useAuth } from '../../../auth/presentation/context/AuthContext'

export function RutaProtegida({ roles, children }: { roles: Rol[]; children: ReactNode }) {
  const { usuario, cargando } = useAuth()

  if (cargando) return <p role="status">Verificando tu sesión…</p>
  if (!usuario) return <Navigate to="/login" replace />
  if (!roles.includes(usuario.rol)) return <Navigate to="/" replace />

  return <>{children}</>
}
