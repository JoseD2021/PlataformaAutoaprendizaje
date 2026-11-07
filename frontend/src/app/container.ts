import { GuiasHttpRepository } from '../features/guias/infrastructure/guias-http-repository'
import { httpClient } from '../shared/http/client'
import { ListarCategorias } from '../features/guias/application/listar-categorias'
import { ListarGuiasPorCategoria } from '../features/guias/application/listar-guias-por-categoria'
import { ObtenerCategoria } from '../features/guias/application/obtener-categoria'
import { ObtenerGuia } from '../features/guias/application/obtener-guia'
import type { GuiasRepository } from '../features/guias/domain/guias-repository'

export function crearContenedor(repoOverride?: GuiasRepository) {
  const repo = repoOverride ?? new GuiasHttpRepository(httpClient)

  return {
    listarCategorias: new ListarCategorias(repo),
    listarGuiasPorCategoria: new ListarGuiasPorCategoria(repo),
    obtenerCategoria: new ObtenerCategoria(repo),
    obtenerGuia: new ObtenerGuia(repo),
  }
}

export const container = crearContenedor()
