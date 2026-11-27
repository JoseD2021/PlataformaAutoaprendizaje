import { Navigate } from 'react-router-dom'
import { NavegacionVolver } from '../../../../shared/components/NavegacionVolver'
import { PageLayout } from '../../../../shared/components/PageLayout'
import { tienePermiso } from '../../../../shared/permisos'
import { useAuth } from '../../../auth/presentation/context/AuthContext'
import { PrivacidadAdminPanel } from '../components/PrivacidadAdminPanel'
import '../privacidad-admin.css'

export function PrivacidadAdminPage() {
  const { usuario, cargando } = useAuth()

  if (cargando) return null
  if (!usuario || !tienePermiso(usuario, 'privacy-terms:manage')) return <Navigate to="/" replace />

  return (
    <PageLayout>
      <div className="privacidad-admin">
        <NavegacionVolver conAtras={false} conAccionesAdmin />
        <h1>Tratamiento de datos</h1>
        <p>Edita el aviso de privacidad que deben aceptar las personas al crear una cuenta.</p>
        <PrivacidadAdminPanel />
      </div>
    </PageLayout>
  )
}
