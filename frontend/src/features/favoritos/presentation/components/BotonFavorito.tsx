import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Star, X } from 'lucide-react'
import { useAuth } from '../../../auth/presentation/context/AuthContext'
import { useFavoritos } from '../hooks/useFavoritos'
import { useToggleFavorito } from '../hooks/useToggleFavorito'

export function BotonFavorito({ guiaId }: { guiaId: string }) {
  const { usuario } = useAuth()
  const { data: favoritos } = useFavoritos()
  const { agregar, quitar } = useToggleFavorito()
  const dialogRef = useRef<HTMLDialogElement>(null)

  const esFavorito = favoritos?.some((guia) => guia.id === guiaId) ?? false
  const enviando = agregar.isPending || quitar.isPending

  function alternar() {
    if (!usuario) {
      dialogRef.current?.showModal()
      return
    }
    if (esFavorito) {
      quitar.mutate(guiaId)
    } else {
      agregar.mutate(guiaId)
    }
  }

  return (
    <>
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

      <dialog ref={dialogRef} className="sala-dialog" aria-labelledby="favorito-login-titulo">
        <h2 id="favorito-login-titulo">Inicia sesión para guardar favoritos</h2>
        <p>Para guardar esta guía en tus favoritos, primero debes iniciar sesión.</p>
        <div className="guia-paso__acciones">
          <button
            type="button"
            className="btn btn--contorno"
            onClick={() => dialogRef.current?.close()}
          >
            <X aria-hidden size={20} /> Cancelar
          </button>
          <Link to="/login" className="btn btn--verde">
            Iniciar sesión
          </Link>
        </div>
        <p className="formulario-enlace">
          ¿Todavía no estás registrado? <Link to="/registro">Regístrate</Link>
        </p>
      </dialog>
    </>
  )
}
