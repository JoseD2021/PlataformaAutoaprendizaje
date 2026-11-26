import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, X } from 'lucide-react'
import { PageLayout } from '../../../../shared/components/PageLayout'
import type { DatosGuia } from '../../domain/entities'
import { GuiaForm } from '../components/GuiaForm'
import {
  useCategoriasGestion,
  useGuiasGestion,
  useGuiaGestion,
  useMutacionesGestion,
  useSubirImagenGuia,
} from '../hooks/useGestion'
import { guiasMasPedidaAnterior } from '../../application/mas-pedida'
import { mensajeDeError } from '../mensaje-error'
import '../gestion.css'

interface ConfirmacionMasPedida {
  id: string | undefined
  datos: DatosGuia
  anteriores: string[]
}

const GUIA_NUEVA: DatosGuia = {
  titulo: '',
  categoriaId: '',
  minutosEstimados: 0,
  esMasPedida: false,
  etiqueta: '',
  palabrasClave: '',
  pasos: [],
}

export function GuiaFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const categorias = useCategoriasGestion()
  const guia = useGuiaGestion(id)
  const guias = useGuiasGestion()
  const { crearGuia, actualizarGuia } = useMutacionesGestion()
  const subirImagen = useSubirImagenGuia()
  const [error, setError] = useState<string | null>(null)
  const [confirmacion, setConfirmacion] = useState<ConfirmacionMasPedida | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (confirmacion) dialogRef.current?.showModal()
  }, [confirmacion])

  async function guardarCambios(idGuia: string | undefined, datos: DatosGuia) {
    setError(null)
    try {
      if (idGuia) {
        await actualizarGuia.mutateAsync({ id: idGuia, datos })
      } else {
        await crearGuia.mutateAsync(datos)
      }
      navigate('/gestion')
    } catch (e) {
      setError(mensajeDeError(e))
    }
  }

  function guardar(datos: DatosGuia) {
    const anteriores = guiasMasPedidaAnterior(
      guias.data?.items ?? [],
      categorias.data ?? [],
      datos,
      id,
    )

    if (datos.esMasPedida && anteriores.length > 0) {
      setConfirmacion({
        id,
        datos,
        anteriores: anteriores.map((anterior) => anterior.titulo),
      })
      return
    }

    void guardarCambios(id, datos)
  }

  async function confirmarGuardado() {
    if (!confirmacion) return
    const { id: idGuia, datos } = confirmacion
    dialogRef.current?.close()
    setConfirmacion(null)
    await guardarCambios(idGuia, datos)
  }

  function cancelarConfirmacion() {
    dialogRef.current?.close()
    setConfirmacion(null)
  }

  const contenido = () => {
    if (categorias.isLoading || guia.isLoading) return <p role="status">Cargando…</p>
    if (categorias.isError || guia.isError || !categorias.data) {
      return <p role="alert" className="gestion-mensaje">No se pudo cargar la información.</p>
    }
    if (id && !guia.data) {
      return <p role="alert" className="gestion-mensaje">Esta guía no existe.</p>
    }

    let inicial = GUIA_NUEVA
    if (guia.data) {
      const g = guia.data
      // El listado puede identificar la categoría por slug; el formulario necesita su id.
      const categoria = categorias.data.find((c) => c.id === g.categoriaId || c.slug === g.categoriaId)
      inicial = {
        titulo: g.titulo,
        categoriaId: categoria?.id ?? '',
        minutosEstimados: g.minutosEstimados,
        esMasPedida: g.esMasPedida,
        etiqueta: g.etiqueta,
        palabrasClave: g.palabrasClave,
        pasos: g.pasos,
      }
    }

    return (
      <GuiaForm
        key={id ?? 'nueva'}
        inicial={inicial}
        categorias={categorias.data}
        enviando={crearGuia.isPending || actualizarGuia.isPending}
        error={error}
        textoBoton={id ? 'Guardar cambios' : 'Crear guía en borrador'}
        onGuardar={guardar}
        onSubirImagen={(archivo) => subirImagen.mutateAsync(archivo)}
      />
    )
  }

  return (
    <PageLayout>
      <div className="gestion">
        <Link to="/gestion" className="btn-enlace">
          <ArrowLeft aria-hidden size={20} /> Volver a gestión
        </Link>
        <h1>{id ? 'Editar guía' : 'Nueva guía'}</h1>
        {!id && <p>La guía se crea como borrador. Publícala desde la lista cuando esté lista.</p>}
        {guia.data && (
          <p>
            Estado actual: <strong>{guia.data.estado === 'publicada' ? 'publicada' : 'borrador'}</strong>
          </p>
        )}
        {contenido()}
        {confirmacion && (
          <dialog
            ref={dialogRef}
            className="gestion-dialog"
            aria-labelledby="mas-pedida-titulo"
            onClose={() => setConfirmacion(null)}
          >
            <h2 id="mas-pedida-titulo">Cambiar la guía «La más pedida»</h2>
            <p>
              Se quitará la marca «La más pedida» de{' '}
              <strong>{confirmacion.anteriores.map((titulo) => `«${titulo}»`).join(', ')}</strong>.
            </p>
            <p>Solo puede haber una guía «La más pedida» por categoría.</p>
            <div className="gestion-acciones">
              <button
                type="button"
                className="btn btn--claro btn-sm"
                onClick={cancelarConfirmacion}
              >
                <X aria-hidden size={16} /> Cancelar
              </button>
              <button
                type="button"
                className="btn btn--verde btn-sm"
                onClick={() => void confirmarGuardado()}
              >
                <Check aria-hidden size={16} /> Continuar
              </button>
            </div>
          </dialog>
        )}
      </div>
    </PageLayout>
  )
}
