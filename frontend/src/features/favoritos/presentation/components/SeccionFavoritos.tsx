import { GuiaItem } from '../../../guias/presentation/components/GuiaItem'
import { useAuth } from '../../../auth/presentation/context/AuthContext'
import { useFavoritos } from '../hooks/useFavoritos'

export function SeccionFavoritos() {
  const { usuario } = useAuth()
  const { data: favoritos, isLoading } = useFavoritos()

  if (!usuario || isLoading || !favoritos || favoritos.length === 0) {
    return null
  }

  return (
    <section aria-labelledby="mis-favoritos">
      <h2 id="mis-favoritos" className="otros-temas">Mis favoritos</h2>
      <ul className="guias-lista">
        {favoritos.map((guia) => (
          <li key={guia.id}>
            <GuiaItem guia={guia} />
          </li>
        ))}
      </ul>
    </section>
  )
}
