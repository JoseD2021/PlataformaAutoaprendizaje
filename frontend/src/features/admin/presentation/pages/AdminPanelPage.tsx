import { Navigate } from 'react-router-dom'
import { PageLayout } from '../../../../shared/components/PageLayout'
import { useAuth } from '../../../auth/presentation/context/AuthContext'

export function AdminPanelPage() {
  const { usuario, cargando } = useAuth()

  if (cargando) return null
  if (!usuario || usuario.rol !== 'administrador') return <Navigate to="/" replace />

  return (
    <PageLayout>
      <h1>Panel de administración</h1>
      <p>Esta sección está en construcción. Pronto podrás gestionar usuarios, roles y guías desde aquí.</p>
    </PageLayout>
  )
}
