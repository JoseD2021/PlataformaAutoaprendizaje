import { Navigate } from 'react-router-dom'
import { NavegacionVolver } from '../../../../shared/components/NavegacionVolver'
import { PageLayout } from '../../../../shared/components/PageLayout'
import { tienePermiso } from '../../../../shared/permisos'
import { useAuth } from '../../../auth/presentation/context/AuthContext'
import { UsuariosPanel } from '../components/UsuariosPanel'
import '../admin.css'

export function AdminPanelPage() {
  const { usuario, cargando } = useAuth()

  if (cargando) return null
  if (!usuario || !tienePermiso(usuario, 'users:read')) return <Navigate to="/" replace />

  return (
    <PageLayout>
      <div className="admin">
        <NavegacionVolver conAtras={false} conAccionesAdmin />
        <h1>Panel de administración</h1>
        <p>Cambia el rol de las personas registradas. El cambio se aplica al guardar.</p>

        <UsuariosPanel />
      </div>
    </PageLayout>
  )
}
