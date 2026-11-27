import { Fragment } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  Clock,
  FileText,
  Home,
  MessageCircleQuestion,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useAuth } from '../../features/auth/presentation/context/AuthContext'
import {
  PERMISOS_GESTION,
  PERMISOS_USUARIOS,
  tieneAlgunPermiso,
  type Permiso,
} from '../permisos'

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

  const acciones: {
    ruta: string
    etiqueta: string
    Icono: LucideIcon
    permisos: Permiso[]
    siempreVisible?: boolean
  }[] = [
    {
      ruta: '/dudas',
      etiqueta: 'Dudas sin guía',
      Icono: MessageCircleQuestion,
      permisos: ['doubts:manage'],
      siempreVisible: true,
    },
    { ruta: '/admin', etiqueta: 'Gestionar usuarios', Icono: Users, permisos: PERMISOS_USUARIOS },
    { ruta: '/gestion', etiqueta: 'Guías y categorías', Icono: BookOpen, permisos: PERMISOS_GESTION },
    { ruta: '/horario', etiqueta: 'Horario de la sala', Icono: Clock, permisos: ['room-info:manage'] },
    { ruta: '/roles', etiqueta: 'Gestionar roles', Icono: FileText, permisos: ['roles:read'] },
    {
      ruta: '/privacidad',
      etiqueta: 'Tratamiento de datos',
      Icono: FileText,
      permisos: ['privacy-terms:manage'],
    },
  ]
  const visibles = acciones.filter(
    (accion) =>
      tieneAlgunPermiso(usuario, accion.permisos) && (accion.siempreVisible || conAccionesAdmin),
  )

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
      {visibles.map((accion) => (
        <Fragment key={accion.ruta}>
          <span className="separador-nav" aria-hidden>·</span>
          <Link to={accion.ruta} className="btn-enlace">
            <accion.Icono aria-hidden size={18} /> {accion.etiqueta}
          </Link>
        </Fragment>
      ))}
    </nav>
  )
}
