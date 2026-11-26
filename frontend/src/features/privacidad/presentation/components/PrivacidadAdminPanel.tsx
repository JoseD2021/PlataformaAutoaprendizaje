import { useState, type FormEvent } from 'react'
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from 'lucide-react'
import { obtenerMensajeError } from '../../../../shared/http/obtener-mensaje-error'
import type { SeccionTerminosPrivacidad, TerminosPrivacidad } from '../../domain/entities'
import { useActualizarTerminosPrivacidad, useTerminosPrivacidad } from '../hooks/useTerminosPrivacidad'

function clonar(terminos: TerminosPrivacidad): TerminosPrivacidad {
  return {
    ...terminos,
    secciones: terminos.secciones.map((s) => ({ titulo: s.titulo, parrafos: [...s.parrafos] })),
  }
}

function mover<T>(lista: T[], desde: number, hacia: number): T[] {
  if (hacia < 0 || hacia >= lista.length) return lista
  const copia = [...lista]
  const [item] = copia.splice(desde, 1)
  copia.splice(hacia, 0, item)
  return copia
}

export function PrivacidadAdminPanel() {
  const { data, isLoading, isError } = useTerminosPrivacidad()
  const actualizar = useActualizarTerminosPrivacidad()
  const [form, setForm] = useState<TerminosPrivacidad | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cargadoVersion, setCargadoVersion] = useState<string | null>(null)

  if (data && cargadoVersion !== data.version) {
    setForm(clonar(data))
    setCargadoVersion(data.version)
  }

  if (isLoading) return <p role="status">Cargando aviso de privacidad…</p>
  if (isError || !data || !form) {
    return <p role="alert" className="privacidad-admin-mensaje">No se pudo cargar el aviso de privacidad.</p>
  }

  const actual = form

  function actualizarCampo<K extends keyof TerminosPrivacidad>(campo: K, valor: TerminosPrivacidad[K]) {
    setForm((prev) => (prev ? { ...prev, [campo]: valor } : prev))
  }

  function actualizarSeccion(indice: number, seccion: SeccionTerminosPrivacidad) {
    setForm((prev) =>
      prev ? { ...prev, secciones: prev.secciones.map((s, i) => (i === indice ? seccion : s)) } : prev,
    )
  }

  function agregarSeccion() {
    setForm((prev) =>
      prev
        ? { ...prev, secciones: [...prev.secciones, { titulo: '', parrafos: [''] }] }
        : prev,
    )
  }

  function eliminarSeccion(indice: number) {
    setForm((prev) => (prev ? { ...prev, secciones: prev.secciones.filter((_, i) => i !== indice) } : prev))
  }

  function moverSeccion(indice: number, dir: -1 | 1) {
    setForm((prev) => (prev ? { ...prev, secciones: mover(prev.secciones, indice, indice + dir) } : prev))
  }

  function cambiarParrafo(seccionIdx: number, parrafoIdx: number, valor: string) {
    const seccion = actual.secciones[seccionIdx]
    actualizarSeccion(seccionIdx, {
      ...seccion,
      parrafos: seccion.parrafos.map((p, i) => (i === parrafoIdx ? valor : p)),
    })
  }

  function agregarParrafo(seccionIdx: number) {
    const seccion = actual.secciones[seccionIdx]
    actualizarSeccion(seccionIdx, { ...seccion, parrafos: [...seccion.parrafos, ''] })
  }

  function eliminarParrafo(seccionIdx: number, parrafoIdx: number) {
    const seccion = actual.secciones[seccionIdx]
    actualizarSeccion(seccionIdx, { ...seccion, parrafos: seccion.parrafos.filter((_, i) => i !== parrafoIdx) })
  }

  function moverParrafo(seccionIdx: number, parrafoIdx: number, dir: -1 | 1) {
    const seccion = actual.secciones[seccionIdx]
    actualizarSeccion(seccionIdx, { ...seccion, parrafos: mover(seccion.parrafos, parrafoIdx, parrafoIdx + dir) })
  }

  async function guardar(e: FormEvent) {
    e.preventDefault()
    setAviso(null)
    setError(null)

    const payload: TerminosPrivacidad = {
      version: actual.version.trim(),
      fechaVigencia: actual.fechaVigencia.trim(),
      titulo: actual.titulo.trim(),
      secciones: actual.secciones.map((s) => ({
        titulo: s.titulo.trim(),
        parrafos: s.parrafos.map((p) => p.trim()),
      })),
    }

    if (!payload.version || !payload.fechaVigencia || !payload.titulo) {
      setError('Completa la versión, fecha de vigencia y título.')
      return
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.fechaVigencia)) {
      setError('La fecha de vigencia debe tener formato AAAA-MM-DD.')
      return
    }
    if (payload.secciones.length === 0) {
      setError('Debe existir al menos una sección.')
      return
    }
    if (payload.secciones.some((s) => !s.titulo || s.parrafos.length === 0 || s.parrafos.some((p) => !p))) {
      setError('Cada sección debe tener título y al menos un párrafo sin vacíos.')
      return
    }

    try {
      const guardado = await actualizar.mutateAsync(payload)
      setForm(clonar(guardado))
      setAviso('El aviso de privacidad se guardó correctamente.')
    } catch (err) {
      setError(obtenerMensajeError(err))
    }
  }

  return (
    <form className="privacidad-admin-form" onSubmit={guardar}>
      {aviso && <p role="status" className="privacidad-admin-aviso">{aviso}</p>}
      {error && <p role="alert" className="privacidad-admin-mensaje">{error}</p>}

      <section className="privacidad-admin-seccion" aria-labelledby="datos-aviso-titulo">
        <h2 id="datos-aviso-titulo">Datos del aviso</h2>
        <div className="privacidad-admin-grid">
          <div className="campo">
            <label htmlFor="priv-version">Versión</label>
            <input id="priv-version" type="text" maxLength={32} value={form.version}
              onChange={(e) => actualizarCampo('version', e.target.value)} />
          </div>
          <div className="campo">
            <label htmlFor="priv-fecha">Fecha de vigencia (AAAA-MM-DD)</label>
            <input id="priv-fecha" type="text" maxLength={10} value={form.fechaVigencia}
              onChange={(e) => actualizarCampo('fechaVigencia', e.target.value)} placeholder="2026-11-26" />
          </div>
        </div>
        <div className="campo">
          <label htmlFor="priv-titulo">Título</label>
          <input id="priv-titulo" type="text" maxLength={160} value={form.titulo}
            onChange={(e) => actualizarCampo('titulo', e.target.value)} />
        </div>
      </section>

      <section className="privacidad-admin-seccion" aria-labelledby="secciones-titulo">
        <div className="privacidad-admin-seccion-encabezado">
          <h2 id="secciones-titulo">Secciones</h2>
          <button type="button" className="btn btn--claro btn-sm" onClick={agregarSeccion}>
            <Plus aria-hidden size={16} /> Agregar sección
          </button>
        </div>

        <div className="privacidad-admin-lista">
          {form.secciones.map((seccion, si) => (
            <fieldset key={si} className="privacidad-admin-bloque">
              <legend>Sección {si + 1}</legend>
              <div className="campo">
                <label htmlFor={`sec-titulo-${si}`}>Título de la sección</label>
                <input id={`sec-titulo-${si}`} type="text" maxLength={160} value={seccion.titulo}
                  onChange={(e) => actualizarSeccion(si, { ...seccion, titulo: e.target.value })} />
              </div>

              <div className="privacidad-admin-parrafos">
                {seccion.parrafos.map((parrafo, pi) => (
                  <div key={pi} className="privacidad-admin-parrafo">
                    <div className="campo">
                      <label htmlFor={`sec-${si}-par-${pi}`}>Párrafo {pi + 1}</label>
                      <textarea id={`sec-${si}-par-${pi}`} rows={3} maxLength={1000} value={parrafo}
                        onChange={(e) => cambiarParrafo(si, pi, e.target.value)} />
                    </div>
                    <div className="privacidad-admin-fila-acciones">
                      <button type="button" className="btn btn--claro btn-sm" onClick={() => moverParrafo(si, pi, -1)} disabled={pi === 0} aria-label={`Subir párrafo ${pi + 1} de sección ${si + 1}`}>
                        <ArrowUp aria-hidden size={16} /> Subir
                      </button>
                      <button type="button" className="btn btn--claro btn-sm" onClick={() => moverParrafo(si, pi, 1)} disabled={pi === seccion.parrafos.length - 1} aria-label={`Bajar párrafo ${pi + 1} de sección ${si + 1}`}>
                        <ArrowDown aria-hidden size={16} /> Bajar
                      </button>
                      <button type="button" className="btn btn--peligro btn-sm" onClick={() => eliminarParrafo(si, pi)} aria-label={`Eliminar párrafo ${pi + 1} de sección ${si + 1}`}>
                        <Trash2 aria-hidden size={16} /> Eliminar
                      </button>
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn--claro btn-sm" onClick={() => agregarParrafo(si)}>
                  <Plus aria-hidden size={16} /> Agregar párrafo
                </button>
              </div>

              <div className="privacidad-admin-fila-acciones">
                <button type="button" className="btn btn--claro btn-sm" onClick={() => moverSeccion(si, -1)} disabled={si === 0} aria-label={`Subir sección ${si + 1}`}>
                  <ArrowUp aria-hidden size={16} /> Subir sección
                </button>
                <button type="button" className="btn btn--claro btn-sm" onClick={() => moverSeccion(si, 1)} disabled={si === form.secciones.length - 1} aria-label={`Bajar sección ${si + 1}`}>
                  <ArrowDown aria-hidden size={16} /> Bajar sección
                </button>
                <button type="button" className="btn btn--peligro btn-sm" onClick={() => eliminarSeccion(si)} aria-label={`Eliminar sección ${si + 1}`}>
                  <Trash2 aria-hidden size={16} /> Eliminar sección
                </button>
              </div>
            </fieldset>
          ))}
        </div>
      </section>

      <div className="privacidad-admin-acciones">
        <button type="submit" className="btn btn--verde" disabled={actualizar.isPending}>
          <Save aria-hidden size={18} /> {actualizar.isPending ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}
