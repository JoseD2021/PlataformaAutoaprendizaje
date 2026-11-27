/** Duda sin guía anotada por el personal. */
export interface Duda {
  id: string
  duda: string
  tema: string
  veces: number
  ultimaVez: string
}

export interface NuevaDuda {
  duda: string
  categoriaId: string
}

export interface CategoriaDuda {
  id: string
  nombre: string
}

export type CampoOrdenDuda = 'duda' | 'tema' | 'veces' | 'ultimaVez'
export type DireccionOrden = 'asc' | 'desc'

export interface OrdenDudas {
  campo: CampoOrdenDuda
  direccion: DireccionOrden
}
