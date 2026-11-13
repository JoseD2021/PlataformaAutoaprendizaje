import { useRef } from 'react'
import { X } from 'lucide-react'
import type { TerminosPrivacidad } from '../../domain/entities'

interface Props {
  terminos: TerminosPrivacidad
  aceptado: boolean
  onCambio: (aceptado: boolean) => void
}

function formatearFecha(fecha: string): string {
  const [anio, mes, dia] = fecha.split('-').map(Number)
  if (!anio || !mes || !dia) return fecha
  return new Date(anio, mes - 1, dia).toLocaleDateString('es', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function AceptarAvisoPrivacidad({ terminos, aceptado, onCambio }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (
    <>
      <div className="campo campo--checkbox">
        <label htmlFor="registro-terminos">
          <input
            id="registro-terminos"
            type="checkbox"
            checked={aceptado}
            onChange={(e) => onCambio(e.target.checked)}
            required
          />
          <span>He leído y acepto el aviso de privacidad.</span>
        </label>
      </div>

      <button
        type="button"
        className="enlace-boton"
        onClick={() => dialogRef.current?.showModal()}
      >
        Leer el aviso de privacidad
      </button>

      <dialog ref={dialogRef} className="terminos-dialog" aria-labelledby="terminos-titulo">
        <h2 id="terminos-titulo">{terminos.titulo}</h2>
        <p className="terminos-meta">
          Versión {terminos.version} · Vigente desde el {formatearFecha(terminos.fechaVigencia)}
        </p>

        {terminos.secciones.map((seccion) => (
          <section key={seccion.titulo}>
            <h3>{seccion.titulo}</h3>
            {seccion.parrafos.map((parrafo) => (
              <p key={parrafo}>{parrafo}</p>
            ))}
          </section>
        ))}

        <button
          type="button"
          className="btn btn--marca"
          onClick={() => dialogRef.current?.close()}
        >
          <X aria-hidden size={20} /> Cerrar
        </button>
      </dialog>
    </>
  )
}
