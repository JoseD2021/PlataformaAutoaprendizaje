import { GuiasMockRepository } from '../features/guias/infrastructure/guias-mock-repository'
import { ListarCategorias } from '../features/guias/application/listar-categorias'
import { ListarGuiasPorCategoria } from '../features/guias/application/listar-guias-por-categoria'
import { ObtenerCategoria } from '../features/guias/application/obtener-categoria'

const repo = new GuiasMockRepository() // luego: condicional con VITE_USE_MOCK

export const container = {
  listarCategorias: new ListarCategorias(repo),
  listarGuiasPorCategoria: new ListarGuiasPorCategoria(repo),
  obtenerCategoria: new ObtenerCategoria(repo),
}