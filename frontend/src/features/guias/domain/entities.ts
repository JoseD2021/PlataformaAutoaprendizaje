export interface Categoria {
  id: string
  nombre: string
  descripcion: string
  icono: string          // nombre del ícono, no un componente de React
  esDestacada: boolean   // el "tema más pedido en la sala"
  slug?: string
}

export interface GuiaResumen {
  id: string
  titulo: string
  categoriaId: string
  totalPasos: number
  minutosEstimados: number
  esMasPedida: boolean
  etiqueta?: string   // ej. "Importante en computadores públicos"
}

export interface Paso {
  id: string
  numero: number
  titulo: string
  texto: string
  imagenUrl: string
  imagenAlt: string
}

export interface GuiaDetalle {
  id: string
  titulo: string
  categoriaId: string
  pasos: Paso[]
  totalPasos?: number
  minutosEstimados?: number
  esMasPedida?: boolean
  etiqueta?: string
}

export interface ResultadoBusquedaGuia {
  id: string
  titulo: string
  minutosEstimados: number
  nombreCategoria: string
}
