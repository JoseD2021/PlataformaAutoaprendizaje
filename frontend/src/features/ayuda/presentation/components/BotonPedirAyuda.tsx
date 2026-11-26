import { useRef, useState, type FormEvent } from 'react'
import { CircleHelp, Send, X } from 'lucide-react'
import { obtenerMensajeError } from '../../../../shared/http/obtener-mensaje-error'
import type { ContextoAyuda } from '../../domain/entities'
import { guardarPuesto, obtenerPuestoGuardado } from '../../infrastructure/puesto-storage'
import { usePedirAyuda } from '../hooks/usePedirAyuda'

export function BotonPedirAyuda({ contexto }: { contexto?: ContextoAyuda }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [puesto, setPuesto] = useState('')
  const pedirAyuda = usePedirAyuda()

  function abrir() {
    pedirAyuda.reset()
    setPuesto(obtenerPuestoGuardado())
    dialogRef.current?.showModal()
  }

  function cerrar() {
    dialogRef.current?.close()
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const numeroPuesto = puesto.trim() === '' ? undefined : Number(puesto)
    guardarPuesto(numeroPuesto)
    pedirAyuda.mutate({
      puesto: numeroPuesto,
      guiaId: contexto?.guiaId,
      paso: contexto?.paso,
    })
  }

  const enviada = pedirAyuda.data

  return (
    <>
      <button type="button" className="btn btn--claro" onClick={abrir}>
        <CircleHelp aria-hidden size={18} /> Pedir ayuda
      </button>

      <dialog ref={dialogRef} className="sala-dialog" aria-labelledby="ayuda-titulo">
        {enviada ? (
          <div role="status">
            <h2 id="ayuda-titulo">¡Listo! La asistente ya fue avisada</h2>
            <p className="ayuda-confirmacion">
              {enviada.puesto !== null
                ? <>Va a venir a tu puesto: <strong>computador {enviada.puesto}</strong>.</>
                : 'Va a venir a ayudarte. Quédate donde estás.'}
            </p>
            <button type="button" className="btn btn--marca" onClick={cerrar}>
              <X aria-hidden size={20} /> Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={enviar} noValidate>
            <h2 id="ayuda-titulo">Pedir ayuda a la asistente</h2>

            {contexto ? (
              <p>
                Le diremos que te quedaste en <strong>{contexto.guiaTitulo}</strong>
                {contexto.paso !== undefined && <>, <strong>paso {contexto.paso}</strong></>}.
              </p>
            ) : (
              <p>La asistente vendrá a tu puesto para ayudarte.</p>
            )}

            <div className="campo">
              <label htmlFor="ayuda-puesto">Número de tu computador (opcional)</label>
              <input
                id="ayuda-puesto"
                type="number"
                inputMode="numeric"
                min={1}
                max={999}
                value={puesto}
                onChange={(e) => setPuesto(e.target.value)}
                aria-describedby="ayuda-puesto-ayuda"
              />
              <small id="ayuda-puesto-ayuda">Suele estar pegado en la pantalla o en la torre.</small>
            </div>

            {pedirAyuda.isError && (
              <p role="alert" className="formulario-error">
                {obtenerMensajeError(pedirAyuda.error)}
              </p>
            )}

            <div className="guia-paso__acciones">
              <button type="button" className="btn btn--contorno" onClick={cerrar}>
                <X aria-hidden size={20} /> Cancelar
              </button>
              <button type="submit" className="btn btn--verde" disabled={pedirAyuda.isPending}>
                <Send aria-hidden size={20} />
                {pedirAyuda.isPending ? 'Avisando…' : 'Avisar a la asistente'}
              </button>
            </div>
          </form>
        )}
      </dialog>
    </>
  )
}
