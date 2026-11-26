import { useEffect, useRef, useState } from 'react'
import { obtenerMensajeError } from '../../../../shared/http/obtener-mensaje-error'
import { useAuth } from '../../../auth/presentation/context/AuthContext'
import { useTerminosPrivacidad } from '../hooks/useTerminosPrivacidad'

function formatearFecha(fecha: string): string {
  const [anio, mes, dia] = fecha.split('-').map(Number)
  const valor = new Date(anio, mes - 1, dia)

  if (Number.isNaN(valor.getTime())) return fecha

  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'long' }).format(valor)
}

export function DialogoAceptarTerminosActualizados() {
  const { usuario, aceptarTerminosPrivacidad, cerrarSesion } = useAuth()
  const { data: terminos, isLoading, isError } = useTerminosPrivacidad()
  const bloqueoRef = useRef<HTMLDialogElement>(null)
  const detalleRef = useRef<HTMLDialogElement>(null)
  const [aceptado, setAceptado] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debeAceptar = Boolean(usuario?.requiereAceptarTerminosPrivacidad)

  useEffect(() => {
    const dialog = bloqueoRef.current
    if (!dialog) return
    if (debeAceptar && !dialog.open) dialog.showModal()
    if (!debeAceptar && dialog.open) dialog.close()
  }, [debeAceptar])

  if (!debeAceptar) return null

  async function aceptar() {
    if (!terminos || !aceptado) return
    setError(null)
    setGuardando(true)
    try {
      await aceptarTerminosPrivacidad(terminos.version)
    } catch (e) {
      setError(obtenerMensajeError(e))
    } finally {
      setGuardando(false)
    }
  }

  return (
    <dialog
      ref={bloqueoRef}
      className="terminos-dialog"
      aria-labelledby="terminos-actualizados-titulo"
      onCancel={(e) => e.preventDefault()}
    >
      <h2 id="terminos-actualizados-titulo">El aviso de privacidad cambió</h2>
      <p>
        Para continuar usando tu cuenta, revisa y acepta la versión vigente del aviso de privacidad.
      </p>

      {isLoading && <p role="status">Cargando el aviso de privacidad…</p>}
      {isError && <p role="alert">No pudimos cargar el aviso de privacidad. Intenta de nuevo.</p>}

      {terminos && (
        <>
          <p><strong>{terminos.titulo}</strong></p>
          <p className="terminos-meta">
            Versión {terminos.version} · Vigente desde el {formatearFecha(terminos.fechaVigencia)}
          </p>
          <button type="button" className="btn-enlace" onClick={() => detalleRef.current?.showModal()}>
            Leer el aviso de privacidad
          </button>

          <dialog ref={detalleRef} className="terminos-dialog" aria-labelledby="terminos-vigentes-titulo">
            <h2 id="terminos-vigentes-titulo">{terminos.titulo}</h2>
            <p className="terminos-meta">
              Versión {terminos.version} · Vigente desde el {formatearFecha(terminos.fechaVigencia)}
            </p>
            {terminos.secciones.map((seccion) => (
              <section key={seccion.titulo}>
                <h3>{seccion.titulo}</h3>
                {seccion.parrafos.map((parrafo) => <p key={parrafo}>{parrafo}</p>)}
              </section>
            ))}
            <button type="button" className="btn btn--marca" onClick={() => detalleRef.current?.close()}>
              Cerrar
            </button>
          </dialog>

          <div className="campo campo--checkbox" style={{ marginTop: '1rem' }}>
            <label htmlFor="aceptar-terminos-vigentes">
              <input
                id="aceptar-terminos-vigentes"
                type="checkbox"
                checked={aceptado}
                onChange={(e) => setAceptado(e.target.checked)}
              />
              <span>He leído y acepto la versión vigente del aviso de privacidad.</span>
            </label>
          </div>
        </>
      )}

      {error && <p role="alert" className="mensaje-error">{error}</p>}

      <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <button type="button" className="btn btn--verde" disabled={!aceptado || !terminos || guardando} onClick={aceptar}>
          {guardando ? 'Guardando…' : 'Aceptar y continuar'}
        </button>
        <button type="button" className="btn btn--claro" onClick={() => void cerrarSesion()} disabled={guardando}>
          Cerrar sesión
        </button>
      </div>
    </dialog>
  )
}
