import { Link } from 'react-router-dom'
import { GuiaItem } from '../../../guias/presentation/components/GuiaItem'
import { useAuth } from '../../../auth/presentation/context/AuthContext'
import { useFavoritos } from '../hooks/useFavoritos'

const LIMITE_FAVORITOS_INICIO = 4

export function SeccionFavoritos() {
  const { usuario } = useAuth()
  const { data: favoritos, isLoading } = useFavoritos()

  if (!usuario || isLoading || !favoritos || favoritos.length === 0) {
    return null
  }

  const visibles = favoritos.slice(0, LIMITE_FAVORITOS_INICIO)

  return (
    <section aria-labelledby="mis-favoritos">
      <h2 id="mis-favoritos" className="otros-temas">Mis favoritos</h2>
      <ul className="guias-lista">
        {visibles.map((guia) => (
          <li key={guia.id}>
            <GuiaItem guia={guia} />
          </li>
        ))}
      </ul>
      {favoritos.length > LIMITE_FAVORITOS_INICIO && (
        <Link to="/favoritos" className="btn-enlace">
          Ver todos mis favoritos ({favoritos.length})
        </Link>
      )}
    </section>
  )
}
