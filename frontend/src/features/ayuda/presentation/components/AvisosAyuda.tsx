import { useEffect, useState } from 'react'
import { Check, ChevronDown, Hand } from 'lucide-react'
import { useAuth } from '../../../auth/presentation/context/AuthContext'
import type { SolicitudAyuda } from '../../domain/entities'
import { useAyudasPendientes, useMarcarAyudaAtendida } from '../hooks/useAyudasPendientes'

/** Cuántas tarjetas se ven antes de «Ver todas». */
export const MAXIMO_VISIBLES = 3
/** A partir de estos minutos de espera la tarjeta se resalta. */
export const MINUTOS_DEMORA = 5
const REFRESCO_RELOJ_MS = 30_000

/** Hora actual que se actualiza sola, para recalcular «hace N min». */
function useAhora() {
  const [ahora, setAhora] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setAhora(Date.now()), REFRESCO_RELOJ_MS)
    return () => clearInterval(id)
  }, [])

  return ahora
}

function horaCorta(fechaIso: string) {
  return new Date(fechaIso).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' })
}

function textoEspera(minutos: number) {
  if (minutos < 1) return 'hace menos de 1 min'
  return `hace ${minutos} min`
}

function TarjetaAyuda({ solicitud, ahora }: { solicitud: SolicitudAyuda; ahora: number }) {
  const marcarAtendida = useMarcarAyudaAtendida()
  const titulo = solicitud.puesto !== null ? `Puesto ${solicitud.puesto}` : 'Puesto sin indicar'
  const minutos = Math.max(0, Math.floor((ahora - new Date(solicitud.creadaEn).getTime()) / 60_000))
  const demorada = minutos >= MINUTOS_DEMORA

  return (
    <li className={`aviso-ayuda${demorada ? ' aviso-ayuda--demorada' : ''}`}>
      <p className="aviso-ayuda__titulo">
        <Hand aria-hidden size={20} /> {titulo}
      </p>
      <p>{solicitud.solicitante ?? 'Visitante sin cuenta'}</p>
      {solicitud.guiaTitulo && (
        <p>
          {solicitud.guiaTitulo}
          {solicitud.paso !== null && ` · paso ${solicitud.paso}`}
        </p>
      )}
      <p className="aviso-ayuda__hora">
        {horaCorta(solicitud.creadaEn)} ·{' '}
        {demorada ? <strong>Lleva {minutos} min esperando</strong> : textoEspera(minutos)}
      </p>
      <button
        type="button"
        className="btn btn--verde"
        onClick={() => marcarAtendida.mutate(solicitud.id)}
        disabled={marcarAtendida.isPending}
        aria-label={`Marcar como atendida: ${titulo}`}
      >
        <Check aria-hidden size={18} /> Atendida
      </button>
    </li>
  )
}

/** Tarjetas flotantes con las solicitudes pendientes; solo las ve el personal. */
export function AvisosAyuda() {
  const { usuario } = useAuth()
  const esPersonal = usuario?.rol === 'personal_clena' || usuario?.rol === 'administrador'
  const { data: pendientes } = useAyudasPendientes(esPersonal)
  const ahora = useAhora()
  const [mostrarTodas, setMostrarTodas] = useState(false)
  // Cantidad que había al minimizar: si llega una solicitud nueva, el panel se vuelve a abrir solo.
  const [minimizadoCon, setMinimizadoCon] = useState<number | null>(null)

  if (!esPersonal || !pendientes?.length) return null

  const cantidad = pendientes.length
  const resumen =
    cantidad === 1 ? 'Alguien está pidiendo ayuda' : `${cantidad} personas están pidiendo ayuda`

  if (minimizadoCon !== null && cantidad <= minimizadoCon) {
    return (
      <button
        type="button"
        className="btn btn--marca avisos-ayuda--minimizado"
        onClick={() => setMinimizadoCon(null)}
        aria-label={`${resumen}. Mostrar solicitudes`}
      >
        <Hand aria-hidden size={20} /> {cantidad} pidiendo ayuda
      </button>
    )
  }

  const visibles = mostrarTodas ? pendientes : pendientes.slice(0, MAXIMO_VISIBLES)
  const ocultas = cantidad - visibles.length

  return (
    <section className="avisos-ayuda" aria-live="polite" aria-label="Solicitudes de ayuda">
      <div className="avisos-ayuda__barra">
        <h2 className="avisos-ayuda__encabezado">{resumen}</h2>
        <button
          type="button"
          className="btn-enlace"
          onClick={() => {
            setMinimizadoCon(cantidad)
            setMostrarTodas(false)
          }}
        >
          <ChevronDown aria-hidden size={18} /> Minimizar
        </button>
      </div>
      <ul>
        {visibles.map((solicitud) => (
          <TarjetaAyuda key={solicitud.id} solicitud={solicitud} ahora={ahora} />
        ))}
      </ul>
      {ocultas > 0 && (
        <button type="button" className="btn btn--contorno" onClick={() => setMostrarTodas(true)}>
          Ver {ocultas} más
        </button>
      )}
    </section>
  )
}
