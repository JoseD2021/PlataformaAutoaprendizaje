import type { Categoria } from '../../domain/entities'

export function rutaDeCategoria(categoria: Categoria): string {
  const identificador = categoria.slug?.trim() || categoria.id
  return `/categorias/${encodeURIComponent(identificador)}`
}
