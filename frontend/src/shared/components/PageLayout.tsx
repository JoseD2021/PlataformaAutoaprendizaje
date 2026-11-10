import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { LogIn, LogOut, CircleHelp } from 'lucide-react'
import { useAuth } from '../../features/auth/presentation/context/AuthContext'

export function PageLayout({ hero, children }: { hero?: ReactNode; children: ReactNode }) {
  const { usuario, cerrarSesion } = useAuth()

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
            {usuario ? (
              <>
                <span className="usuario-activo">Hola, {usuario.nombreCompleto.split(' ')[0]}</span>
                <button type="button" className="btn btn--contorno" onClick={cerrarSesion}>
                  <LogOut aria-hidden size={18} /> Cerrar sesión
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn--contorno">
                <LogIn aria-hidden size={18} /> Iniciar sesión
              </Link>
            )}
            <button type="button" className="btn btn--claro">
              <CircleHelp aria-hidden size={18} /> Pedir ayuda
            </button>
          </div>
        </div>
        {hero && <div className="app-header__hero">{hero}</div>}
      </header>
      <main id="contenido" className="contenedor">{children}</main>
    </>
  )
}