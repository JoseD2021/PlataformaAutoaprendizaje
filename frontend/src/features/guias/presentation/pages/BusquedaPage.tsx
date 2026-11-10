import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageLayout } from '../../../../shared/components/PageLayout'
import { HeroBusqueda } from '../components/HeroBusqueda'
import { ResultadoBusquedaItem } from '../components/ResultadoBusquedaItem'
import { useBusquedaGuias } from '../hooks/useBusquedaGuias'

export function BusquedaPage() {
  const [parametros] = useSearchParams()
  const consulta = parametros.get('q') ?? ''
  const busqueda = useBusquedaGuias(consulta)

  const contenido = () => {
    if (consulta.trim().length < 2)
      return <p role="status">Escribe al menos dos letras en el buscador de arriba.</p>
    if (busqueda.isLoading) return <p role="status">Buscando guías…</p>
    if (busqueda.isError)
      return <p role="alert">No pudimos hacer la búsqueda. Pide ayuda a un monitor.</p>

    const resultados = busqueda.data?.pages.flatMap((pagina) => pagina.items) ?? []
    const total = busqueda.data?.pages[0]?.total ?? 0

    if (resultados.length === 0)
      return (
        <p>
          No encontramos guías para «{consulta}». Prueba con otras palabras, por ejemplo
          «foto» o «correo».
        </p>
      )

    return (
      <>
        <p>Encontramos {total === 1 ? '1 guía' : `${total} guías`}:</p>
        <ul className="guias-lista">
          {resultados.map((resultado) => (
            <li key={resultado.id}>
              <ResultadoBusquedaItem resultado={resultado} />
            </li>
          ))}
        </ul>
        {busqueda.hasNextPage && (
          <div className="busqueda-mas">
            <button
              type="button"
              className="btn btn--verde"
              onClick={() => busqueda.fetchNextPage()}
              disabled={busqueda.isFetchingNextPage}
            >
              Ver más resultados
            </button>
            {busqueda.isFetchingNextPage && (
              <p role="status" className="buscador-aviso">Cargando más resultados…</p>
            )}
          </div>
        )}
      </>
    )
  }

  return (
    <PageLayout hero={<HeroBusqueda valorInicial={consulta} />}>
      <Link to="/" className="volver">
        <ArrowLeft aria-hidden size={16} /> Volver al inicio
      </Link>
      <h1>Resultados para «{consulta}»</h1>
      {contenido()}
    </PageLayout>
  )
}
