import { useCategorias } from '../hooks/useCategorias'
import { CategoriaCard } from '../components/CategoriaCard'

export function InicioPage() {
  const { data, isLoading, isError } = useCategorias()

  if (isLoading) return <p role="status">Cargando temas…</p>
  if (isError || !data) return <p role="alert">No pudimos cargar los temas. Pida ayuda a un monitor.</p>

  return (
    <main id="contenido">
      <h1>¿Qué quiere aprender hoy?</h1>
      <ul className="categorias-grid">
        {data.map((c) => (
          <li key={c.id}><CategoriaCard categoria={c} /></li>
        ))}
      </ul>
    </main>
  )
}