import { Navigate } from 'react-router-dom'
import { NavegacionVolver } from '../../../../shared/components/NavegacionVolver'
import { PageLayout } from '../../../../shared/components/PageLayout'
import { tienePermiso } from '../../../../shared/permisos'
import { useAuth } from '../../../auth/presentation/context/AuthContext'
import { HorarioSalaPanel } from '../components/HorarioSalaPanel'
import '../horario-sala.css'

export function HorarioSalaPage() {
  const { usuario, cargando } = useAuth()

  if (cargando) return null
  if (!usuario || !tienePermiso(usuario, 'room-info:manage')) return <Navigate to="/" replace />

  return (
    <PageLayout>
      <div className="horario-admin">
        <NavegacionVolver conAtras={false} conAccionesAdmin />
        <h1>Horario y normas de la sala</h1>
        <p>Actualiza el horario de atención y las normas que ven las personas usuarias.</p>
        <HorarioSalaPanel />
      </div>
    </PageLayout>
  )
}
