import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { useAuth } from '../../../auth/presentation/context/AuthContext'
import type { Favorito } from '../../domain/entities'
import { useFavoritos } from '../hooks/useFavoritos'

export function BotonFavorito({ guia }: { guia: Favorito }) {
  const { usuario } = useAuth()
  const { favoritos, agregar, quitar } = useFavoritos(usuario?.id)

  if (!usuario) {
    return (
      <Link to="/login" className="btn btn--contorno btn-favorito">
        <Star aria-hidden size={20} /> Inicia sesión para guardar en favoritos
      </Link>
    )
  }

  const esFavorita = favoritos.some((f) => f.guiaId === guia.guiaId)

  return (
    <div className="btn-favorito">
      <button
        type="button"
        className="btn btn--claro"
        onClick={() => (esFavorita ? quitar.mutate(guia.guiaId) : agregar.mutate(guia))}
      >
        <Star aria-hidden size={20} fill={esFavorita ? 'currentColor' : 'none'} />
        {esFavorita ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      </button>
      {esFavorita && <p role="status" className="estado-favorito">Esta guía está en «Mis favoritos».</p>}
    </div>
  )
}