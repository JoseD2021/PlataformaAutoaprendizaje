import { describe, it, expect } from 'vitest'
import { ListarCategorias } from './listar-categorias'
import type { GuiasRepository } from '../domain/guias-repository'
import type { Categoria } from '../domain/entities'

const categoria: Categoria = {
  id: 'correo', nombre: 'Correo', descripcion: 'x', icono: 'mail', esDestacada: true,
}

const repoFalso: GuiasRepository = {
  listarCategorias: async () => [categoria],
  listarGuiasPorCategoria: async () => [],
  obtenerCategoria: async () => null,
  obtenerGuia: async () => null,
  buscarGuias: async () => ({ items: [], total: 0, pagina: 1, totalPaginas: 0 }),
}

describe('ListarCategorias', () => {
  it('devuelve las categorías que entrega el repositorio', async () => {
    const resultado = await new ListarCategorias(repoFalso).execute()
    expect(resultado).toEqual([categoria])
  })
})