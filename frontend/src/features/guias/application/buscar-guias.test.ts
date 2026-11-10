import { describe, it, expect, vi } from 'vitest'
import { BuscarGuias } from './buscar-guias'
import type { GuiasRepository } from '../domain/guias-repository'
import type { ResultadoBusquedaGuia } from '../domain/entities'

const resultadoEjemplo: ResultadoBusquedaGuia = {
  id: 'enviar-correo-foto',
  titulo: 'Enviar un correo con una foto',
  minutosEstimados: 3,
  nombreCategoria: 'Correo',
}

const pagina = {
  items: [resultadoEjemplo],
  total: 1,
  pagina: 1,
  totalPaginas: 1,
}

const repoFalso: GuiasRepository = {
  listarCategorias: async () => [],
  listarGuiasPorCategoria: async () => [],
  obtenerCategoria: async () => null,
  obtenerGuia: async () => null,
  buscarGuias: vi.fn(async () => pagina),
}

describe('BuscarGuias', () => {
  it('delega la búsqueda al repositorio con la consulta y la página', async () => {
    const casoDeUso = new BuscarGuias(repoFalso)
    const resultado = await casoDeUso.execute('mandar foto', { pagina: 2, limite: 10 })

    expect(vi.mocked(repoFalso.buscarGuias)).toHaveBeenCalledWith('mandar foto', 2, 10)
    expect(resultado).toEqual(pagina)
  })

  it('recorta la consulta antes de buscar', async () => {
    const casoDeUso = new BuscarGuias(repoFalso)
    await casoDeUso.execute('  foto  ')

    expect(vi.mocked(repoFalso.buscarGuias)).toHaveBeenCalledWith('foto', 1, 10)
  })

  it('no llama al repositorio si la consulta es demasiado corta', async () => {
    const casoDeUso = new BuscarGuias(repoFalso)
    const resultado = await casoDeUso.execute('f')

    expect(vi.mocked(repoFalso.buscarGuias)).not.toHaveBeenCalled()
    expect(resultado).toEqual({ items: [], total: 0, pagina: 1, totalPaginas: 0 })
  })

  it('no llama al repositorio si la consulta supera los 100 caracteres', async () => {
    const casoDeUso = new BuscarGuias(repoFalso)
    const resultado = await casoDeUso.execute('a'.repeat(101))

    expect(vi.mocked(repoFalso.buscarGuias)).not.toHaveBeenCalled()
    expect(resultado.items).toEqual([])
  })

  it('limita el tamaño de página al máximo que acepta el backend', async () => {
    const casoDeUso = new BuscarGuias(repoFalso)
    await casoDeUso.execute('foto', { limite: 500 })

    expect(vi.mocked(repoFalso.buscarGuias)).toHaveBeenCalledWith('foto', 1, 50)
  })
})
