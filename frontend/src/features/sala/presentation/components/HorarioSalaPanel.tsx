import { useEffect, useState, type FormEvent } from 'react'
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from 'lucide-react'
import { obtenerMensajeError } from '../../../../shared/http/obtener-mensaje-error'
import type { HorarioDia, InformacionSala } from '../../domain/entities'
import { useActualizarInformacionSala, useInformacionSala } from '../hooks/useInformacionSala'

const HORARIO_VACIO: HorarioDia = { dias: '', horas: '' }
const MAX_HORARIOS = 20
const MAX_NORMAS = 30

function clonarInfo(info: InformacionSala): InformacionSala {
  return {
    horarios: info.horarios.map((h) => ({ ...h })),
    normas: [...info.normas],
  }
}

function mover<T>(lista: T[], desde: number, hacia: number): T[] {
  if (hacia < 0 || hacia >= lista.length) return lista
  const copia = [...lista]
  const [item] = copia.splice(desde, 1)
  copia.splice(hacia, 0, item)
  return copia
}

export function HorarioSalaPanel() {
  const { data, isLoading, isError } = useInformacionSala()
  const actualizar = useActualizarInformacionSala()
  const [horarios, setHorarios] = useState<HorarioDia[]>([])
  const [normas, setNormas] = useState<string[]>([])
  const [aviso, setAviso] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cargado, setCargado] = useState(false)

  useEffect(() => {
    if (data && !cargado) {
      const copia = clonarInfo(data)
      setHorarios(copia.horarios)
      setNormas(copia.normas)
      setCargado(true)
    }
  }, [data, cargado])

  if (isLoading) return <p role="status">Cargando información de la sala…</p>
  if (isError || !data) {
    return <p role="alert" className="horario-admin-mensaje">No se pudo cargar la información de la sala.</p>
  }

  function cambiarHorario(indice: number, campo: keyof HorarioDia, valor: string) {
    setHorarios((actual) => actual.map((h, i) => (i === indice ? { ...h, [campo]: valor } : h)))
  }

  function agregarHorario() {
    setHorarios((actual) => (actual.length < MAX_HORARIOS ? [...actual, { ...HORARIO_VACIO }] : actual))
  }

  function eliminarHorario(indice: number) {
    setHorarios((actual) => actual.filter((_, i) => i !== indice))
  }

  function moverHorario(indice: number, direccion: -1 | 1) {
    setHorarios((actual) => mover(actual, indice, indice + direccion))
  }

  function cambiarNorma(indice: number, valor: string) {
    setNormas((actual) => actual.map((n, i) => (i === indice ? valor : n)))
  }

  function agregarNorma() {
    setNormas((actual) => (actual.length < MAX_NORMAS ? [...actual, ''] : actual))
  }

  function eliminarNorma(indice: number) {
    setNormas((actual) => actual.filter((_, i) => i !== indice))
  }

  function moverNorma(indice: number, direccion: -1 | 1) {
    setNormas((actual) => mover(actual, indice, indice + direccion))
  }

  async function guardar(evento: FormEvent) {
    evento.preventDefault()
    setAviso(null)
    setError(null)

    const payload: InformacionSala = {
      horarios: horarios.map((h) => ({ dias: h.dias.trim(), horas: h.horas.trim() })),
      normas: normas.map((n) => n.trim()),
    }

    if (payload.horarios.some((h) => !h.dias || !h.horas)) {
      setError('Completa los días y las horas de cada horario, o elimina la fila vacía.')
      return
    }
    if (payload.normas.some((n) => !n)) {
      setError('Completa cada norma, o elimina la norma vacía.')
      return
    }

    try {
      const guardado = await actualizar.mutateAsync(payload)
      setHorarios(clonarInfo(guardado).horarios)
      setNormas([...guardado.normas])
      setAviso('La información de la sala se guardó correctamente.')
    } catch (e) {
      setError(obtenerMensajeError(e))
    }
  }

  return (
    <form className="horario-admin-form" onSubmit={guardar}>
      {aviso && <p role="status" className="horario-admin-aviso">{aviso}</p>}
      {error && <p role="alert" className="horario-admin-mensaje">{error}</p>}

      <section aria-labelledby="horarios-titulo" className="horario-admin-seccion">
        <div className="horario-admin-seccion-encabezado">
          <h2 id="horarios-titulo">Horarios de atención</h2>
          <button
            type="button"
            className="btn btn--claro btn-sm"
            onClick={agregarHorario}
            disabled={horarios.length >= MAX_HORARIOS}
          >
            <Plus aria-hidden size={16} /> Agregar horario
          </button>
        </div>

        {horarios.length === 0 ? (
          <p>No hay horarios configurados.</p>
        ) : (
          <div className="horario-admin-lista">
            {horarios.map((horario, indice) => (
              <fieldset key={indice} className="horario-admin-fila">
                <legend className="admin-solo-lectores">Horario {indice + 1}</legend>
                <div className="campo">
                  <label htmlFor={`horario-dias-${indice}`}>Días</label>
                  <input
                    id={`horario-dias-${indice}`}
                    type="text"
                    maxLength={80}
                    value={horario.dias}
                    onChange={(e) => cambiarHorario(indice, 'dias', e.target.value)}
                    placeholder="Ej.: Lunes a viernes"
                  />
                </div>
                <div className="campo">
                  <label htmlFor={`horario-horas-${indice}`}>Horas</label>
                  <input
                    id={`horario-horas-${indice}`}
                    type="text"
                    maxLength={80}
                    value={horario.horas}
                    onChange={(e) => cambiarHorario(indice, 'horas', e.target.value)}
                    placeholder="Ej.: 8:00 a.m. a 5:00 p.m."
                  />
                </div>
                <div className="horario-admin-fila-acciones">
                  <button
                    type="button"
                    className="btn btn--claro btn-sm"
                    onClick={() => moverHorario(indice, -1)}
                    disabled={indice === 0}
                    aria-label={`Subir horario ${indice + 1}`}
                  >
                    <ArrowUp aria-hidden size={16} /> Subir
                  </button>
                  <button
                    type="button"
                    className="btn btn--claro btn-sm"
                    onClick={() => moverHorario(indice, 1)}
                    disabled={indice === horarios.length - 1}
                    aria-label={`Bajar horario ${indice + 1}`}
                  >
                    <ArrowDown aria-hidden size={16} /> Bajar
                  </button>
                  <button
                    type="button"
                    className="btn btn--peligro btn-sm"
                    onClick={() => eliminarHorario(indice)}
                    aria-label={`Eliminar horario ${indice + 1}`}
                  >
                    <Trash2 aria-hidden size={16} /> Eliminar
                  </button>
                </div>
              </fieldset>
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="normas-titulo" className="horario-admin-seccion">
        <div className="horario-admin-seccion-encabezado">
          <h2 id="normas-titulo">Normas</h2>
          <button
            type="button"
            className="btn btn--claro btn-sm"
            onClick={agregarNorma}
            disabled={normas.length >= MAX_NORMAS}
          >
            <Plus aria-hidden size={16} /> Agregar norma
          </button>
        </div>

        {normas.length === 0 ? (
          <p>No hay normas configuradas.</p>
        ) : (
          <div className="horario-admin-lista">
            {normas.map((norma, indice) => (
              <div key={indice} className="horario-admin-fila horario-admin-fila--norma">
                <div className="campo">
                  <label htmlFor={`norma-${indice}`}>Norma {indice + 1}</label>
                  <input
                    id={`norma-${indice}`}
                    type="text"
                    maxLength={300}
                    value={norma}
                    onChange={(e) => cambiarNorma(indice, e.target.value)}
                    placeholder="Escribe una norma"
                  />
                </div>
                <div className="horario-admin-fila-acciones">
                  <button
                    type="button"
                    className="btn btn--claro btn-sm"
                    onClick={() => moverNorma(indice, -1)}
                    disabled={indice === 0}
                    aria-label={`Subir norma ${indice + 1}`}
                  >
                    <ArrowUp aria-hidden size={16} /> Subir
                  </button>
                  <button
                    type="button"
                    className="btn btn--claro btn-sm"
                    onClick={() => moverNorma(indice, 1)}
                    disabled={indice === normas.length - 1}
                    aria-label={`Bajar norma ${indice + 1}`}
                  >
                    <ArrowDown aria-hidden size={16} /> Bajar
                  </button>
                  <button
                    type="button"
                    className="btn btn--peligro btn-sm"
                    onClick={() => eliminarNorma(indice)}
                    aria-label={`Eliminar norma ${indice + 1}`}
                  >
                    <Trash2 aria-hidden size={16} /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="horario-admin-acciones">
        <button type="submit" className="btn btn--verde" disabled={actualizar.isPending}>
          <Save aria-hidden size={18} /> {actualizar.isPending ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}
