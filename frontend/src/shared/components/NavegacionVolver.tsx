import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'

export function NavegacionVolver({ conAtras = true }: { conAtras?: boolean }) {
  const navigate = useNavigate()
  const location = useLocation()
  // 'default' = la persona llegó directo a esta URL, no hay página anterior dentro de la app
  const hayHistorialInterno = location.key !== 'default'

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
    </nav>
  )
}