import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import type { CategoriaGestion, DatosCategoria } from '../../domain/entities'
import { useCategoriasGestion, useMutacionesGestion } from '../hooks/useGestion'
import { mensajeDeError } from '../mensaje-error'

const ICONOS = [
  { valor: 'mail', etiqueta: 'Correo' },
  { valor: 'landmark', etiqueta: 'Trámites' },
  { valor: 'file-text', etiqueta: 'Documentos' },
  { valor: 'users', etiqueta: 'Redes sociales' },
  { valor: 'shield', etiqueta: 'Seguridad' },
]

const VACIO: DatosCategoria = { nombre: '', icono: 'file-text', descripcion: '', esDestacada: false }

interface ConfirmacionDestacada {
  id: string | null
  datos: DatosCategoria
  anteriores: string[]
}

export function CategoriasGestionPanel() {
  const categorias = useCategoriasGestion()
  const { crearCategoria, actualizarCategoria, eliminarCategoria } = useMutacionesGestion()
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [datos, setDatos] = useState<DatosCategoria>(VACIO)
  const [error, setError] = useState<string | null>(null)
  const [confirmacion, setConfirmacion] = useState<ConfirmacionDestacada | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (confirmacion) dialogRef.current?.showModal()
  }, [confirmacion])

  const enviando = crearCategoria.isPending || actualizarCategoria.isPending
  const opcionesIcono = ICONOS.some((i) => i.valor === datos.icono)
    ? ICONOS
    : [...ICONOS, { valor: datos.icono, etiqueta: datos.icono }]

  function empezarEdicion(c: CategoriaGestion) {
    setEditandoId(c.id)
    setDatos({ nombre: c.nombre, icono: c.icono, descripcion: c.descripcion, esDestacada: c.esDestacada })
    setError(null)
  }

  function cancelar() {
    setEditandoId(null)
    setDatos(VACIO)
    setError(null)
  }

  async function guardarCambios(id: string | null, datosGuardar: DatosCategoria) {
    setError(null)
    try {
      if (id) {
        await actualizarCategoria.mutateAsync({ id, datos: datosGuardar })
      } else {
        await crearCategoria.mutateAsync(datosGuardar)
      }
      cancelar()
    } catch (e) {
      setError(mensajeDeError(e))
    }
  }

  function guardar(evento: FormEvent) {
    evento.preventDefault()
    const anteriores = (categorias.data ?? []).filter(
      (c) => c.esDestacada && c.id !== editandoId,
    )

    if (datos.esDestacada && anteriores.length > 0) {
      setConfirmacion({
        id: editandoId,
        datos,
        anteriores: anteriores.map((c) => c.nombre),
      })
      return
    }

    void guardarCambios(editandoId, datos)
  }

  async function confirmarGuardado() {
    if (!confirmacion) return
    const { id, datos: datosGuardar } = confirmacion
    dialogRef.current?.close()
    setConfirmacion(null)
    await guardarCambios(id, datosGuardar)
  }

  function cancelarConfirmacion() {
    dialogRef.current?.close()
    setConfirmacion(null)
  }

  async function borrar(c: CategoriaGestion) {
    if (!window.confirm(`¿Eliminar la categoría «${c.nombre}»?`)) return
    setError(null)
    try {
      await eliminarCategoria.mutateAsync(c.id)
      if (editandoId === c.id) cancelar()
    } catch (e) {
      setError(mensajeDeError(e))
    }
  }

  return (
    <section aria-label="Categorías" className="gestion-categorias">
      <form className="gestion-form gestion-form--compacto" onSubmit={guardar}>
        <h2>{editandoId ? 'Editar categoría' : 'Nueva categoría'}</h2>

        <div className="campo">
          <label htmlFor="cat-nombre">Nombre</label>
          <input
            id="cat-nombre"
            type="text"
            required
            maxLength={80}
            value={datos.nombre}
            onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
          />
        </div>
        <div className="campo">
          <label htmlFor="cat-descripcion">Descripción corta</label>
          <input
            id="cat-descripcion"
            type="text"
            required
            maxLength={200}
            value={datos.descripcion}
            onChange={(e) => setDatos({ ...datos, descripcion: e.target.value })}
          />
        </div>
        <div className="campo">
          <label htmlFor="cat-icono">Ícono</label>
          <select
            id="cat-icono"
            value={datos.icono}
            onChange={(e) => setDatos({ ...datos, icono: e.target.value })}
          >
            {opcionesIcono.map((i) => (
              <option key={i.valor} value={i.valor}>{i.etiqueta}</option>
            ))}
          </select>
        </div>
        <div className="campo campo--check">
          <input
            id="cat-destacada"
            type="checkbox"
            checked={datos.esDestacada}
            onChange={(e) => setDatos({ ...datos, esDestacada: e.target.checked })}
          />
          <label htmlFor="cat-destacada">Mostrar como «tema más pedido» en el inicio</label>
        </div>

        {error && <p role="alert" className="gestion-mensaje">{error}</p>}

        <div className="gestion-acciones">
          <button type="submit" className="btn btn--verde btn-sm" disabled={enviando}>
            <Plus aria-hidden size={16} /> {editandoId ? 'Guardar cambios' : 'Crear categoría'}
          </button>
          {editandoId && (
            <button type="button" className="btn btn--claro btn-sm" onClick={cancelar}>
              <X aria-hidden size={16} /> Cancelar edición
            </button>
          )}
        </div>
      </form>

      {confirmacion && (
        <dialog
          ref={dialogRef}
          className="gestion-dialog"
          aria-labelledby="destacada-titulo"
          onClose={() => setConfirmacion(null)}
        >
          <h2 id="destacada-titulo">Cambiar la categoría destacada</h2>
          <p>
            Se quitará el destacado de{' '}
            <strong>{confirmacion.anteriores.map((nombre) => `«${nombre}»`).join(', ')}</strong>.
          </p>
          <p>Solo puede haber una categoría destacada a la vez.</p>
          <div className="gestion-acciones">
            <button
              type="button"
              className="btn btn--claro btn-sm"
              onClick={cancelarConfirmacion}
              disabled={enviando}
            >
              <X aria-hidden size={16} /> Cancelar
            </button>
            <button
              type="button"
              className="btn btn--verde btn-sm"
              onClick={() => void confirmarGuardado()}
              disabled={enviando}
            >
              <Check aria-hidden size={16} /> {enviando ? 'Guardando…' : 'Continuar'}
            </button>
          </div>
        </dialog>
      )}

      <h2>Categorías existentes</h2>
      {categorias.isLoading && <p role="status">Cargando categorías…</p>}
      {categorias.isError && <p role="alert" className="gestion-mensaje">No se pudieron cargar las categorías.</p>}
      {categorias.data && categorias.data.length === 0 && <p>Todavía no hay categorías.</p>}
      {categorias.data && categorias.data.length > 0 && (
        <ul className="gestion-lista">
          {categorias.data.map((c) => (
            <li key={c.id}>
              <div>
                <strong>{c.nombre}</strong>
                {c.esDestacada && <span className="chip chip--rojo gestion-chip">Destacada</span>}
                <br />
                <small>{c.descripcion}</small>
              </div>
              <div className="gestion-acciones">
                <button type="button" className="btn btn--claro btn-sm" onClick={() => empezarEdicion(c)}>
                  <Pencil aria-hidden size={16} /> Editar
                </button>
                <button
                  type="button"
                  className="btn btn--peligro btn-sm"
                  onClick={() => borrar(c)}
                  disabled={eliminarCategoria.isPending}
                >
                  <Trash2 aria-hidden size={16} /> Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
