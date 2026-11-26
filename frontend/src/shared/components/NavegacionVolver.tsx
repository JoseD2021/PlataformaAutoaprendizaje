import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, Clock, FileText, Home, Users } from 'lucide-react'
import { useAuth } from '../../features/auth/presentation/context/AuthContext'

export function NavegacionVolver({
  conAtras = true,
  conAccionesAdmin = false,
}: {
  conAtras?: boolean
  conAccionesAdmin?: boolean
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const { usuario } = useAuth()
  // 'default' = la persona llegó directo a esta URL, no hay página anterior dentro de la app
  const hayHistorialInterno = location.key !== 'default'
  const esAdmin = usuario?.rol === 'administrador'

  return (
    <nav className="navegacion-superior" aria-label="Navegación de retorno">
      {conAtras && hayHistorialInterno && (
        <>
          <button type="button" className="btn-enlace" onClick={() => navigate(-1)}>
            <ArrowLeft aria-hidden size={20} /> Volver a la página anterior
          </button>
          <span className="separador-nav" aria-hidden>·</span>
        </>
      )}
      <Link to="/" className="btn-enlace">
        <Home aria-hidden size={20} /> Volver al inicio
      </Link>
      {conAccionesAdmin && esAdmin && (
        <>
          <span className="separador-nav" aria-hidden>·</span>
          <Link to="/admin" className="btn-enlace">
            <Users aria-hidden size={18} /> Gestionar usuarios
          </Link>
          <span className="separador-nav" aria-hidden>·</span>
          <Link to="/gestion" className="btn-enlace">
            <BookOpen aria-hidden size={18} /> Guías y categorías
          </Link>
          <span className="separador-nav" aria-hidden>·</span>
          <Link to="/horario" className="btn-enlace">
            <Clock aria-hidden size={18} /> Horario de la sala
          </Link>
          <span className="separador-nav" aria-hidden>·</span>
          <button type="button" className="btn-enlace">
            <FileText aria-hidden size={18} /> Gestionar roles
          </button>
          <span className="separador-nav" aria-hidden>·</span>
          <button type="button" className="btn-enlace">
            <FileText aria-hidden size={18} /> Tratamiento de datos
          </button>
        </>
      )}
    </nav>
  )
}