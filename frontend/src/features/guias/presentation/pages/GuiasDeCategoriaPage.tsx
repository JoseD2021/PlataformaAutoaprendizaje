import { Link, useParams } from 'react-router-dom'
import { useGuiasPorCategoria } from '../hooks/useGuiasPorCategoria'

export function GuiasDeCategoriaPage() {
  const { id = '' } = useParams()
  const { data, isLoading, isError } = useGuiasPorCategoria(id)

  if (isLoading) return <p role="status">Cargando guías…</p>
  if (isError || !data) return <p role="alert">No pudimos cargar las guías. Pida ayuda a un monitor.</p>

  return (
    <main id="contenido">
      <h1>Guías</h1>
      {data.length === 0 ? (
        <p>Todavía no hay guías en este tema.</p>
      ) : (
        <ul>
          {data.map((g) => (
            <li key={g.id}>{g.titulo}</li>
          ))}
        </ul>
      )}
      <Link to="/">Volver al inicio</Link>
    </main>
  )
}