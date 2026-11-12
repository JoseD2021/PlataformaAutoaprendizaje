import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageLayout } from '../../../../shared/components/PageLayout'
import type { DatosGuia } from '../../domain/entities'
import { GuiaForm } from '../components/GuiaForm'
import { useCategoriasGestion, useGuiaGestion, useMutacionesGestion } from '../hooks/useGestion'
import { mensajeDeError } from '../mensaje-error'
import '../gestion.css'

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
  const { crearGuia, actualizarGuia } = useMutacionesGestion()
  const [error, setError] = useState<string | null>(null)

  async function guardar(datos: DatosGuia) {
    setError(null)
    try {
      if (id) {
        await actualizarGuia.mutateAsync({ id, datos })
      } else {
        await crearGuia.mutateAsync(datos)
      }
      navigate('/gestion')
    } catch (e) {
      setError(mensajeDeError(e))
    }
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
      </div>
    </PageLayout>
  )
}
