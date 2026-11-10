import { Link } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'
import { useAuth } from '../../../auth/presentation/context/AuthContext'
import { useFavoritos } from '../hooks/useFavoritos'

export function SeccionFavoritos() {
  const { usuario } = useAuth()
  const { favoritos, cargando } = useFavoritos(usuario?.id)

  if (!usuario) return null

  return (
    <section className="favoritos" aria-labelledby="favoritos-titulo">
      <h2 id="favoritos-titulo">Mis favoritos</h2>
      {cargando ? (
        <p role="status">Cargando tus favoritos…</p>
      ) : favoritos.length === 0 ? (
        <p>Aún no tienes guías favoritas. Abre una guía y pulsa «Guardar en favoritos».</p>
      ) : (
        <ul className="guias-lista">
          {favoritos.map((f) => (
            <li key={f.guiaId}>
              <Link to={`/guias/${f.guiaId}`} className="guia-item">
                <div className="guia-item__texto">
                  <strong>{f.titulo}</strong>
                  <span className="guia-item__meta">
                    <Clock aria-hidden size={16} /> {f.totalPasos} pasos · {f.minutosEstimados} minutos
                  </span>
                </div>
                <ArrowRight aria-hidden size={20} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}