import { useMemo, useState, type FormEvent } from 'react'
import { ArrowDown, ArrowDownUp, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { obtenerMensajeError } from '../../../../shared/http/obtener-mensaje-error'
import type { CampoOrdenDuda, Duda, OrdenDudas } from '../../domain/entities'
import {
  useAnotarDuda,
  useCategoriasDudas,
  useDudas,
  useEliminarDuda,
} from '../hooks/useDudas'

const COLUMNAS: { campo: CampoOrdenDuda; etiqueta: string }[] = [
  { campo: 'duda', etiqueta: 'Duda' },
  { campo: 'tema', etiqueta: 'Tema' },
  { campo: 'veces', etiqueta: 'Veces' },
  { campo: 'ultimaVez', etiqueta: 'Última vez' },
]

const ORDEN_INICIAL: OrdenDudas = { campo: 'veces', direccion: 'desc' }

function valorOrden(duda: Duda, campo: CampoOrdenDuda): string | number {
  switch (campo) {
    case 'duda':
      return duda.duda.toLocaleLowerCase('es')
    case 'tema':
      return duda.tema.toLocaleLowerCase('es')
    case 'veces':
      return duda.veces
    case 'ultimaVez':
      return new Date(duda.ultimaVez).getTime()
  }
}

function formatearFecha(fechaIso: string) {
  return new Date(fechaIso).toLocaleString('es-ES', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

export function DudasSinGuiaPanel() {
  const dudas = useDudas()
  const categorias = useCategoriasDudas()
  const anotar = useAnotarDuda()
  const eliminarDuda = useEliminarDuda()
  const [duda, setDuda] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [orden, setOrden] = useState<OrdenDudas>(ORDEN_INICIAL)
  const [mensaje, setMensaje] = useState<{ texto: string; error: boolean } | null>(null)

  // Por defecto, las más preguntadas aparecen primero.
  const filas = useMemo(() => {
    const factor = orden.direccion === 'asc' ? 1 : -1
    return (dudas.data ?? []).toSorted((a, b) => {
      const va = valorOrden(a, orden.campo)
      const vb = valorOrden(b, orden.campo)
      const comparacion =
        typeof va === 'number' && typeof vb === 'number'
          ? va - vb
          : String(va).localeCompare(String(vb), 'es')
      return comparacion * factor
    })
  }, [dudas.data, orden])

  function cambiarOrden(campo: CampoOrdenDuda) {
    setOrden((anterior) =>
      anterior.campo === campo
        ? {
            campo,
            direccion: anterior.direccion === 'asc' ? 'desc' : 'asc',
          }
        : {
            campo,
            direccion: campo === 'veces' || campo === 'ultimaVez' ? 'desc' : 'asc',
          },
    )
  }

  async function enviar(evento: FormEvent) {
    evento.preventDefault()
    setMensaje(null)

    try {
      const resultado = await anotar.mutateAsync({ duda: duda.trim(), categoriaId })
      setDuda('')
      setMensaje({
        texto:
          resultado.veces > 1
            ? `Esa duda ya estaba anotada. Ahora lleva ${resultado.veces} veces.`
            : 'Duda anotada.',
        error: false,
      })
    } catch (error) {
      setMensaje({ texto: obtenerMensajeError(error), error: true })
    }
  }

  async function borrar(registro: Duda) {
    if (!window.confirm(`¿Eliminar la duda «${registro.duda}»?`)) return
    setMensaje(null)

    try {
      await eliminarDuda.mutateAsync(registro.id)
      setMensaje({ texto: 'Duda eliminada.', error: false })
    } catch (error) {
      setMensaje({ texto: obtenerMensajeError(error), error: true })
    }
  }

  return (
    <section className="dudas" aria-label="Dudas sin guía">
      <form className="dudas-form" onSubmit={enviar}>
        <h2>Anotar una duda nueva</h2>

        <div className="campo">
          <label htmlFor="duda-texto">Duda</label>
          <input
            id="duda-texto"
            type="text"
            required
            minLength={3}
            maxLength={300}
            placeholder="¿Qué te preguntaron?"
            value={duda}
            onChange={(evento) => setDuda(evento.target.value)}
          />
        </div>

        <div className="campo">
          <label htmlFor="duda-tema">Tema</label>
          <select
            id="duda-tema"
            required
            value={categoriaId}
            onChange={(evento) => setCategoriaId(evento.target.value)}
          >
            <option value="">Elige un tema</option>
            {categorias.data?.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn btn--verde btn-sm"
          disabled={anotar.isPending || !categorias.data?.length}
        >
          <Plus aria-hidden size={16} /> Anotar duda
        </button>

        {categorias.isError && (
          <p role="alert" className="dudas-mensaje">
            No se pudieron cargar los temas. Intenta recargar la página.
          </p>
        )}
        {mensaje && (
          <p role={mensaje.error ? 'alert' : 'status'} className="dudas-mensaje">
            {mensaje.texto}
          </p>
        )}
      </form>

      <h2>Dudas registradas</h2>
      {dudas.isLoading && <p role="status">Cargando dudas…</p>}
      {dudas.isError && (
        <p role="alert" className="dudas-mensaje">
          No se pudieron cargar las dudas. Intenta de nuevo.
        </p>
      )}
      {dudas.data?.length === 0 && <p>Todavía no hay dudas anotadas.</p>}

      {filas.length > 0 && (
        <div className="dudas-tabla-marco">
          <table className="dudas-tabla">
            <caption className="dudas-solo-lectores">
              Dudas sin guía registradas por el personal
            </caption>
            <thead>
              <tr>
                {COLUMNAS.map(({ campo, etiqueta }) => {
                  const activa = orden.campo === campo
                  const Icono = !activa
                    ? ArrowDownUp
                    : orden.direccion === 'asc'
                      ? ArrowUp
                      : ArrowDown
                  return (
                    <th
                      key={campo}
                      scope="col"
                      aria-sort={
                        activa
                          ? orden.direccion === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                    >
                      <button
                        type="button"
                        className="dudas-orden"
                        onClick={() => cambiarOrden(campo)}
                      >
                        {etiqueta} <Icono aria-hidden size={16} />
                      </button>
                    </th>
                  )
                })}
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((registro) => (
                <tr key={registro.id}>
                  <td>{registro.duda}</td>
                  <td>{registro.tema}</td>
                  <td>{registro.veces}</td>
                  <td>{formatearFecha(registro.ultimaVez)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn--peligro btn-sm"
                      onClick={() => void borrar(registro)}
                      disabled={eliminarDuda.isPending}
                      aria-label={`Eliminar duda: ${registro.duda}`}
                    >
                      <Trash2 aria-hidden size={16} /> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
