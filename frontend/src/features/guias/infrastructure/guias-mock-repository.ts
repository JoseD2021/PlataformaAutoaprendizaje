import type { GuiasRepository } from '../domain/guias-repository'
import type { Categoria, GuiaDetalle, GuiaResumen } from '../domain/entities'
import {
  categoriasMock,
  guiasDetalleMock,
  guiasResumenMock,
} from './guias-mock-data'

export class GuiasMockRepository implements GuiasRepository {
  async listarCategorias(): Promise<Categoria[]> {
    return categoriasMock
  }

  async listarGuiasPorCategoria(categoriaId: string): Promise<GuiaResumen[]> {
    return guiasResumenMock.filter((g) => g.categoriaId === categoriaId)
  }

  async obtenerCategoria(id: string): Promise<Categoria | null> {
    return categoriasMock.find((c) => c.id === id) ?? null
  }

  async obtenerGuia(id: string): Promise<GuiaDetalle | null> {
    return guiasDetalleMock.find((g) => g.id === id) ?? null
  }
}