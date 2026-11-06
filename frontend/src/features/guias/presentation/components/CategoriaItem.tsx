import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Categoria } from '../../domain/entities'
import { Icono } from './iconos'

export function CategoriaItem({ categoria }: { categoria: Categoria }) {
  
  return (
    <Link to={`/categorias/${categoria.id}`} className="tema-item">
      <Icono nombre={categoria.icono} aria-hidden size={24} />
      <span className="tema-item__texto">
        <strong>{categoria.nombre}</strong>
        <small>{categoria.descripcion}</small>
      </span>
      <ArrowRight aria-hidden size={20} />
    </Link>
  )
}