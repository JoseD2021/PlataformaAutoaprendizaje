import { useRef } from 'react'
import { Clock, X } from 'lucide-react'
import { useInformacionSala } from '../hooks/useInformacionSala'

export function BotonHorarioNormas() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { data, isLoading, isError } = useInformacionSala()

  return (
    <>
      <button type="button" className="btn btn--verde boton-flotante"
        onClick={() => dialogRef.current?.showModal()}>
        <Clock aria-hidden size={20} /> Horario y normas
      </button>

      <dialog ref={dialogRef} className="sala-dialog" aria-labelledby="sala-titulo">
        <h2 id="sala-titulo">Horario y normas de la sala</h2>

        {isLoading && <p role="status">Cargando…</p>}
        {isError && <p role="alert">No pudimos cargar la información. Pide ayuda a un monitor.</p>}

        {data && (
          <>
            <h3>Horario de atención</h3>
            <dl className="horarios">
              {data.horarios.map((h) => (
                <div key={h.dias}>
                  <dt>{h.dias}</dt>
                  <dd>{h.horas}</dd>
                </div>
              ))}
            </dl>

            <h3>Normas</h3>
            <ul className="normas">
              {data.normas.map((n) => <li key={n}>{n}</li>)}
            </ul>
          </>
        )}

        <button type="button" className="btn btn--marca" onClick={() => dialogRef.current?.close()}>
          <X aria-hidden size={20} /> Cerrar
        </button>
      </dialog>
    </>
  )
}