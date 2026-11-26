import { Check, Hand } from 'lucide-react'
import { useAuth } from '../../../auth/presentation/context/AuthContext'
import type { SolicitudAyuda } from '../../domain/entities'
import { useAyudasPendientes, useMarcarAyudaAtendida } from '../hooks/useAyudasPendientes'

function horaCorta(fechaIso: string) {
  return new Date(fechaIso).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' })
}

function TarjetaAyuda({ solicitud }: { solicitud: SolicitudAyuda }) {
  const marcarAtendida = useMarcarAyudaAtendida()
  const titulo = solicitud.puesto !== null ? `Puesto ${solicitud.puesto}` : 'Puesto sin indicar'

  return (
    <li className="aviso-ayuda">
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
      <p className="aviso-ayuda__hora">Pidió ayuda a las {horaCorta(solicitud.creadaEn)}</p>
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

  if (!esPersonal || !pendientes?.length) return null

  return (
    <section className="avisos-ayuda" aria-live="polite" aria-label="Solicitudes de ayuda">
      <h2 className="avisos-ayuda__encabezado">
        {pendientes.length === 1
          ? 'Alguien está pidiendo ayuda'
          : `${pendientes.length} personas están pidiendo ayuda`}
      </h2>
      <ul>
        {pendientes.map((solicitud) => (
          <TarjetaAyuda key={solicitud.id} solicitud={solicitud} />
        ))}
      </ul>
    </section>
  )
}
