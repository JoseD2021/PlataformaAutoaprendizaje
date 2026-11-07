import { ArrowRight, Clock } from 'lucide-react'
import type { GuiaResumen } from '../../domain/entities'

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`

export function GuiaItem({ guia }: { guia: GuiaResumen }) {
  return (
    <div className={`guia-item${guia.esMasPedida ? ' guia-item--destacada' : ''}`}>
      <div className="guia-item__texto">
        <strong>{guia.titulo}</strong>
        <span className="guia-item__meta">
          <Clock aria-hidden size={16} />
          {plural(guia.totalPasos, 'paso', 'pasos')} · {plural(guia.minutosEstimados, 'minuto', 'minutos')}
          {guia.esMasPedida && <span className="chip chip--rojo">La más pedida</span>}
          {guia.etiqueta && <span className="chip chip--contorno">{guia.etiqueta}</span>}
        </span>
      </div>
      <ArrowRight aria-hidden size={20} />
    </div>
  )
}