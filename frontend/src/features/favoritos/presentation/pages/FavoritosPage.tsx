import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { PageLayout } from '../../../../shared/components/PageLayout'
import { GuiaItem } from '../../../guias/presentation/components/GuiaItem'
import { useAuth } from '../../../auth/presentation/context/AuthContext'
import { useFavoritos } from '../hooks/useFavoritos'

export function FavoritosPage() {
  const { usuario } = useAuth()
  const { data: favoritos, isLoading, isError } = useFavoritos()

  const contenido = () => {
    if (!usuario) {
      return (
        <p role="alert">
          Debes <Link to="/login">iniciar sesión</Link> para ver tus favoritos.
        </p>
      )
    }
    if (isLoading) return <p role="status">Cargando tus favoritos…</p>
    if (isError) return <p role="alert">No pudimos cargar tus favoritos. Pide ayuda a un monitor.</p>
    if (!favoritos || favoritos.length === 0) {
      return <p>Todavía no has guardado ninguna guía en favoritos.</p>
    }

    return (
      <ul className="guias-lista">
        {favoritos.map((guia) => (
          <li key={guia.id}>
            <GuiaItem guia={guia} />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <PageLayout>
      <nav className="navegacion-superior" aria-label="Navegación de retorno">
        <Link to="/" className="btn-enlace">
          <Home aria-hidden size={20} /> Volver al inicio
        </Link>
      </nav>
      <h1>Mis favoritos</h1>
      {contenido()}
    </PageLayout>
  )
}
