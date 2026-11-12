import { Link, Navigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { NavegacionVolver } from '../../../../shared/components/NavegacionVolver'
import { PageLayout } from '../../../../shared/components/PageLayout'
import { useAuth } from '../../../auth/presentation/context/AuthContext'
import { UsuariosPanel } from '../components/UsuariosPanel'
import '../admin.css'

export function AdminPanelPage() {
  const { usuario, cargando } = useAuth()

  if (cargando) return null
  if (!usuario || usuario.rol !== 'administrador') return <Navigate to="/" replace />

  return (
    <PageLayout>
      <div className="admin">
        <NavegacionVolver conAtras={false} />
        <h1>Panel de administración</h1>
        <p>Cambia el rol de las personas registradas. El cambio se aplica al guardar.</p>

        <div className="admin-barra">
          <Link to="/gestion" className="btn btn--claro btn-sm">
            <BookOpen aria-hidden size={16} /> Gestionar guías y categorías
          </Link>
        </div>

        <UsuariosPanel />
      </div>
    </PageLayout>
  )
}