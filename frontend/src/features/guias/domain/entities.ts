export interface Categoria {
  id: string
  nombre: string
  ilustracionUrl: string
}

export interface GuiaResumen {
  id: string
  titulo: string
  categoriaId: string
}