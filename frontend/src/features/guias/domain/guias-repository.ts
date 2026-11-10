import type { Categoria, GuiaDetalle, GuiaResumen, ResultadoBusquedaGuia } from './entities'

export interface PaginaBusquedaGuias {
  items: ResultadoBusquedaGuia[]
  total: number
  pagina: number
  totalPaginas: number
}

export interface GuiasRepository {
  listarCategorias(): Promise<Categoria[]>
  listarGuiasPorCategoria(categoriaId: string): Promise<GuiaResumen[]>
  obtenerCategoria(id: string): Promise<Categoria | null>
  obtenerGuia(id: string): Promise<GuiaDetalle | null>
  buscarGuias(consulta: string, pagina: number, limite: number): Promise<PaginaBusquedaGuias>
}