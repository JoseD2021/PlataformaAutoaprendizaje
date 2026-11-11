import { Star } from 'lucide-react'
import { useAuth } from '../../../auth/presentation/context/AuthContext'
import { useFavoritos } from '../hooks/useFavoritos'
import { useToggleFavorito } from '../hooks/useToggleFavorito'

export function BotonFavorito({ guiaId }: { guiaId: string }) {
  const { usuario } = useAuth()
  const { data: favoritos } = useFavoritos()
  const { agregar, quitar } = useToggleFavorito()

  if (!usuario) return null

  const esFavorito = favoritos?.some((guia) => guia.id === guiaId) ?? false
  const enviando = agregar.isPending || quitar.isPending

  function alternar() {
    if (esFavorito) {
      quitar.mutate(guiaId)
    } else {
      agregar.mutate(guiaId)
    }
  }

  return (
    <button
      type="button"
      className={`btn ${esFavorito ? 'btn--verde' : 'btn--contorno'}`}
      onClick={alternar}
      disabled={enviando}
      aria-pressed={esFavorito}
    >
      <Star aria-hidden size={18} fill={esFavorito ? 'currentColor' : 'none'} />
      {esFavorito ? 'Guardada en favoritos' : 'Guardar en favoritos'}
    </button>
  )
}
