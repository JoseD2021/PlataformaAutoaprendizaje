import type { ReactNode } from 'react'
import { LogIn, CircleHelp } from 'lucide-react'

export function PageLayout({ hero, children }: { hero?: ReactNode; children: ReactNode }) {
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
            {/* TODO temporal: el inicio de sesión aún no está implementado */}
            <button type="button" className="btn btn--contorno">
              <LogIn aria-hidden size={18} /> Iniciar sesión
            </button>
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