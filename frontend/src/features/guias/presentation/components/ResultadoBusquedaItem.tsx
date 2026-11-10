import { Link } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'
import type { ResultadoBusquedaGuia } from '../../domain/entities'

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`

export function ResultadoBusquedaItem({ resultado }: { resultado: ResultadoBusquedaGuia }) {
  return (
    <Link to={`/guias/${resultado.id}`} className="guia-item">
      <span className="guia-item__texto">
        <strong>{resultado.titulo}</strong>
        <span className="guia-item__meta">
          <Clock aria-hidden size={16} />
          {plural(resultado.minutosEstimados, 'minuto', 'minutos')} de lectura
          <span className="chip chip--contorno">{resultado.nombreCategoria}</span>
        </span>
      </span>
      <ArrowRight aria-hidden size={20} />
    </Link>
  )
}
