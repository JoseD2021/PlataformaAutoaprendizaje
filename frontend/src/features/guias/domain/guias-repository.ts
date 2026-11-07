import type { Categoria, GuiaResumen } from './entities'

export interface GuiasRepository {
  listarCategorias(): Promise<Categoria[]>
  listarGuiasPorCategoria(categoriaId: string): Promise<GuiaResumen[]>
  obtenerCategoria(id: string): Promise<Categoria | null>
}