export interface Categoria {
  id: string
  nombre: string
  descripcion: string
  icono: string          // nombre del ícono, no un componente de React
  esDestacada: boolean   // el "tema más pedido en la sala"
}

export interface GuiaResumen {
  id: string
  titulo: string
  categoriaId: string
}