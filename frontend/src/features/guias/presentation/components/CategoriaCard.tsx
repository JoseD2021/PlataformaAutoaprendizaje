import { Link } from 'react-router-dom'
import type { Categoria } from '../../domain/entities'

export function CategoriaCard({ categoria }: { categoria: Categoria }) {
  return (
    <Link to={`/categorias/${categoria.id}`} className="categoria-card">
      <img src={categoria.ilustracionUrl} alt="" width={96} height={96} />
      <span>{categoria.nombre}</span>
    </Link>
  )
}