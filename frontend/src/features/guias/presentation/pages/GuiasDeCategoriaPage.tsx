import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageLayout } from '../../../../shared/components/PageLayout'
import { useCategoria } from '../hooks/useCategoria'
import { useGuiasPorCategoria } from '../hooks/useGuiasPorCategoria'
import { GuiaItem } from '../components/GuiaItem'

export function GuiasDeCategoriaPage() {
  const { id = '' } = useParams()
  const categoria = useCategoria(id)
  const guias = useGuiasPorCategoria(categoria.data?.id ?? '')

  const contenido = () => {
    if (categoria.isLoading || guias.isLoading) return <p role="status">Cargando guías…</p>
    if (categoria.isError || guias.isError)
      return <p role="alert">No pudimos cargar las guías. Pide ayuda a un monitor.</p>
    if (!categoria.data) return <p role="alert">Ese tema no existe.</p>

    return (
      <>
        <h1>{categoria.data.nombre}</h1>
        <p>Elige lo que quieres hacer. Cada guía te lleva paso a paso.</p>
        {guias.data && guias.data.length > 0 ? (
          <ul className="guias-lista">
            {guias.data.map((g) => <li key={g.id}><GuiaItem guia={g} /></li>)}
          </ul>
        ) : (
          <p>Todavía no hay guías en este tema.</p>
        )}
      </>
    )
  }

  return (
    <PageLayout>
      <Link to="/" className="volver">
        <ArrowLeft aria-hidden size={16} /> Volver al inicio
      </Link>
      {contenido()}
    </PageLayout>
  )
}