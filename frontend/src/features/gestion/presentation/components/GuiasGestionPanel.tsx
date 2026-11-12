import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react'
import type { EstadoGuia, GuiaGestionResumen } from '../../domain/entities'
import { useCategoriasGestion, useGuiasGestion, useMutacionesGestion } from '../hooks/useGestion'
import { mensajeDeError } from '../mensaje-error'

export function GuiasGestionPanel({ estado }: { estado: EstadoGuia }) {
  const guias = useGuiasGestion()
  const categorias = useCategoriasGestion()
  const { cambiarEstado, eliminarGuia } = useMutacionesGestion()
  const [error, setError] = useState<string | null>(null)

  if (guias.isLoading) return <p role="status">Cargando guías…</p>
  if (guias.isError || !guias.data) {
    return <p role="alert" className="gestion-mensaje">No se pudieron cargar las guías.</p>
  }

  const lista = guias.data.items.filter((g) => g.estado === estado)
  const hayMas = guias.data.total > guias.data.items.length
  const nombreCategoria = (id: string) =>
    categorias.data?.find((c) => c.id === id || c.slug === id)?.nombre ?? id

  async function alternarEstado(guia: GuiaGestionResumen) {
    setError(null)
    try {
      await cambiarEstado.mutateAsync({
        id: guia.id,
        estado: guia.estado === 'publicada' ? 'borrador' : 'publicada',
      })
    } catch (e) {
      setError(mensajeDeError(e))
    }
  }

  async function borrar(guia: GuiaGestionResumen) {
    if (!window.confirm(`¿Eliminar la guía «${guia.titulo}»? Esta acción no se puede deshacer.`)) return
    setError(null)
    try {
      await eliminarGuia.mutateAsync(guia.id)
    } catch (e) {
      setError(mensajeDeError(e))
    }
  }

  return (
    <section aria-label={estado === 'publicada' ? 'Guías publicadas' : 'Guías en borrador'}>
      {error && <p role="alert" className="gestion-mensaje">{error}</p>}
      {hayMas && (
        <p className="gestion-aviso">
          Se muestran las primeras {guias.data.items.length} de {guias.data.total} guías.
        </p>
      )}

      {lista.length === 0 ? (
        <p>
          {estado === 'publicada'
            ? 'No hay guías publicadas todavía.'
            : 'No hay borradores. Crea una guía nueva para empezar.'}
        </p>
      ) : (
        <div className="gestion-tabla-marco">
          <table className="gestion-tabla">
            <caption className="gestion-solo-lectores">
              {estado === 'publicada' ? 'Guías publicadas' : 'Guías en borrador'}
            </caption>
            <thead>
              <tr>
                <th scope="col">Título</th>
                <th scope="col">Categoría</th>
                <th scope="col">Pasos</th>
                <th scope="col">Minutos</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((g) => (
                <tr key={g.id}>
                  <td>
                    <strong>{g.titulo}</strong>
                    {g.esMasPedida && <span className="chip chip--rojo gestion-chip">La más pedida</span>}
                  </td>
                  <td>{nombreCategoria(g.categoriaId)}</td>
                  <td>{g.totalPasos}</td>
                  <td>{g.minutosEstimados}</td>
                  <td>
                    <div className="gestion-acciones">
                      <Link to={`/gestion/guias/${encodeURIComponent(g.id)}`} className="btn btn--claro btn-sm">
                        <Pencil aria-hidden size={16} /> Editar
                      </Link>
                      <button
                        type="button"
                        className="btn btn--claro btn-sm"
                        onClick={() => alternarEstado(g)}
                        disabled={cambiarEstado.isPending}
                      >
                        {g.estado === 'publicada' ? (
                          <><EyeOff aria-hidden size={16} /> Ocultar</>
                        ) : (
                          <><Eye aria-hidden size={16} /> Publicar</>
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn--peligro btn-sm"
                        onClick={() => borrar(g)}
                        disabled={eliminarGuia.isPending}
                      >
                        <Trash2 aria-hidden size={16} /> Eliminar
                      </button>
                    </div>
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
