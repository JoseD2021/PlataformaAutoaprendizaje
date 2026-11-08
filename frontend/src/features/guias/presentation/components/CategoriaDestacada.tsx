import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Categoria } from '../../domain/entities'
import { Icono } from './iconos'
import { rutaDeCategoria } from './categoria-route'

export function CategoriaDestacada({ categoria }: { categoria: Categoria }) {
  return (
    <section className="destacada" aria-labelledby="destacada-titulo">
      <span className="etiqueta"><Icono nombre={categoria.icono} aria-hidden size={14} /> El tema más pedido en la sala</span>
      <h2 id="destacada-titulo">{categoria.nombre}</h2>
      <p>{categoria.descripcion}</p>
      <Link to={rutaDeCategoria(categoria)} className="btn btn--marca">
        Ver guías de {categoria.nombre} <ArrowRight aria-hidden size={18} />
      </Link>
    </section>
  )
}