import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LogIn, LogOut } from 'lucide-react'
import { useAuth } from '../../features/auth/presentation/context/AuthContext'
import { BotonPedirAyuda } from '../../features/ayuda/presentation/components/BotonPedirAyuda'
import type { ContextoAyuda } from '../../features/ayuda/domain/entities'
import { PERMISOS_GESTION, tieneAlgunPermiso, tienePermiso } from '../permisos'

interface PageLayoutProps {
  hero?: ReactNode
  children: ReactNode
  /** Guía y paso actuales, para que «Pedir ayuda» le diga a la asistente dónde se quedó. */
  contextoAyuda?: ContextoAyuda
}

export function PageLayout({ hero, children, contextoAyuda }: PageLayoutProps) {
  const { usuario, cerrarSesion } = useAuth()
  // Ajuste de login/registro: no mostrar "Iniciar sesión" en las pantallas de autenticación
  const { pathname } = useLocation()
  const enPantallaAuth = pathname === '/login' || pathname === '/registro'
  const puedeGestionar = tieneAlgunPermiso(usuario, PERMISOS_GESTION)
  const mostrarAyuda = !tienePermiso(usuario, 'help-requests:read')

  return (
    <>
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <header className="app-header">
        <div className="app-header__barra">
          <div className="marca">
            <strong>Aprende Fácil</strong>
            <small>Biblioteca CLENA · Sala de Internet</small>
          </div>
          <div className="app-header__acciones">
            {usuario && (
              <>
                <Link to="/perfil" className="usuario-activo" title="Administrar perfil">
                  {usuario.nombreCompleto.split(' ')[0]}
                </Link>
                {puedeGestionar && (
                  <Link to="/gestion" className="btn btn--claro">Gestión</Link>
                )}
                <button type="button" className="btn btn--contorno" onClick={cerrarSesion}>
                  <LogOut aria-hidden size={18} /> Cerrar sesión
                </button>
              </>
            )}
            {!usuario && !enPantallaAuth && (
              <Link to="/login" className="btn btn--contorno">
                <LogIn aria-hidden size={18} /> Iniciar sesión
              </Link>
            )}
            {mostrarAyuda && <BotonPedirAyuda contexto={contextoAyuda} />}
          </div>
        </div>
        {hero && <div className="app-header__hero">{hero}</div>}
      </header>
      <main id="contenido" className="contenedor">{children}</main>
    </>
  )
}
