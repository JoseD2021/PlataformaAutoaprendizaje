import { describe, it, expect } from 'vitest'
import { ObtenerGuia } from './obtener-guia'
import type { GuiasRepository } from '../domain/guias-repository'
import type { GuiaDetalle } from '../domain/entities'

const guiaDetalle: GuiaDetalle = {
  id: 'enviar-correo-foto',
  titulo: 'Enviar un correo con una foto',
  categoriaId: 'correo',
  pasos: [
    {
      id: 'paso-1',
      numero: 1,
      titulo: 'Abre la ventana para escribir',
      texto: 'Haz clic en Redactar',
      imagenUrl: '/guias/enviar-foto-paso-1.svg',
      imagenAlt: 'Botón Redactar',
    },
  ],
}

const repoFalso: GuiasRepository = {
  listarCategorias: async () => [],
  listarGuiasPorCategoria: async () => [],
  obtenerCategoria: async () => null,
  obtenerGuia: async (id: string) => (id === guiaDetalle.id ? guiaDetalle : null),
}

describe('ObtenerGuia', () => {
  it('devuelve la guía detallada cuando existe', async () => {
    const casoDeUso = new ObtenerGuia(repoFalso)
    const resultado = await casoDeUso.execute('enviar-correo-foto')
    expect(resultado).toEqual(guiaDetalle)
  })

  it('devuelve null cuando la guía no existe', async () => {
    const casoDeUso = new ObtenerGuia(repoFalso)
    const resultado = await casoDeUso.execute('guia-inexistente')
    expect(resultado).toBeNull()
  })
})
