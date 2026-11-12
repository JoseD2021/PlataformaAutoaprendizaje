export type EstadoGuia = 'publicada' | 'borrador'

export interface PasoEditable {
  tituloCorto: string
  accion: string
  descripcion: string
  imagenUrl: string
  pieImagen: string
}

/** Datos que el personal escribe al crear o editar una guía. */
export interface DatosGuia {
  titulo: string
  categoriaId: string
  minutosEstimados: number
  esMasPedida: boolean
  etiqueta: string
  palabrasClave: string
  pasos: PasoEditable[]
}

export interface GuiaGestionResumen {
  id: string
  titulo: string
  categoriaId: string
  totalPasos: number
  minutosEstimados: number
  esMasPedida: boolean
  etiqueta?: string
  estado: EstadoGuia
}

export interface GuiaGestionDetalle extends DatosGuia {
  id: string
  estado: EstadoGuia
}

export interface PaginaGuiasGestion {
  items: GuiaGestionResumen[]
  total: number
  pagina: number
  limite: number
}

export interface CategoriaGestion {
  id: string
  nombre: string
  slug?: string
  icono: string
  descripcion: string
  esDestacada: boolean
}

export interface DatosCategoria {
  nombre: string
  icono: string
  descripcion: string
  esDestacada: boolean
}

/** Error con un mensaje ya pensado para mostrarse a la persona. */
export class ErrorGestion extends Error {
  constructor(mensaje: string) {
    super(mensaje)
    this.name = 'ErrorGestion'
  }
}
