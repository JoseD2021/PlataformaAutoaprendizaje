import { describe, expect, it, vi } from 'vitest'
import { AxiosError, type AxiosInstance, type AxiosResponse } from 'axios'
import { GestionHttpRepository } from './gestion-http-repository'
import { ErrorGestion, type DatosGuia } from '../domain/entities'

function crearRepo(data: unknown = undefined) {
  const http = {
    get: vi.fn().mockResolvedValue({ data }),
    post: vi.fn().mockResolvedValue({ data }),
    put: vi.fn().mockResolvedValue({ data }),
    patch: vi.fn().mockResolvedValue({ data }),
    delete: vi.fn().mockResolvedValue({ data }),
  }
  return { http, repo: new GestionHttpRepository(http as unknown as AxiosInstance) }
}

const datosGuia: DatosGuia = {
  titulo: '  Imprimir un documento ',
  categoriaId: 'uuid-1',
  minutosEstimados: 4,
  esMasPedida: false,
  etiqueta: '',
  palabrasClave: ' imprimir impresora ',
  pasos: [
    { tituloCorto: 'Abrir', accion: 'Abre el documento', descripcion: 'Doble clic', imagenUrl: '', pieImagen: '' },
  ],
}

describe('GestionHttpRepository', () => {
  it('mapea el listado de guías con su estado y paginación', async () => {
    const { repo, http } = crearRepo({
      items: [
        { id: 'a', titulo: 'A', categoriaId: 'correo', totalPasos: 2, minutosEstimados: 1, esMasPedida: false, estado: 'borrador' },
      ],
      total: 1,
      page: 1,
      limit: 100,
    })

    const pagina = await repo.listarGuias(1, 100)

    expect(http.get).toHaveBeenCalledWith('/management/guides', { params: { page: 1, limit: 100 } })
    expect(pagina.items[0].estado).toBe('borrador')
    expect(pagina.total).toBe(1)
  })

  it('ordena los pasos por orden y rellena los campos vacíos', async () => {
    const { repo } = crearRepo({
      id: 'g',
      titulo: 'G',
      categoriaId: 'correo',
      totalPasos: 2,
      minutosEstimados: 3,
      esMasPedida: true,
      estado: 'publicada',
      pasos: [
        { orden: 2, tituloCorto: 'B', accion: 'b', descripcion: 'bb' },
        { orden: 1, tituloCorto: 'A', accion: 'a', descripcion: 'aa', imagenUrl: '/img/a.png' },
      ],
    })

    const guia = await repo.obtenerGuia('g')

    expect(guia?.pasos.map((p) => p.tituloCorto)).toEqual(['A', 'B'])
    expect(guia?.pasos[1].imagenUrl).toBe('')
    expect(guia?.etiqueta).toBe('')
  })

  it('envía la guía sin espacios sobrantes ni campos opcionales vacíos', async () => {
    const { repo, http } = crearRepo()

    await repo.crearGuia(datosGuia)

    const [ruta, cuerpo] = http.post.mock.calls[0]
    expect(ruta).toBe('/management/guides')
    expect(cuerpo.titulo).toBe('Imprimir un documento')
    expect(cuerpo.etiqueta).toBeUndefined()
    expect(cuerpo.palabrasClave).toBe('imprimir impresora')
    expect(cuerpo.pasos[0].imagenUrl).toBeUndefined()
  })

  it('publica y oculta con PATCH al estado', async () => {
    const { repo, http } = crearRepo()

    await repo.cambiarEstadoGuia('g1', 'publicada')

    expect(http.patch).toHaveBeenCalledWith('/management/guides/g1/status', { estado: 'publicada' })
  })

  it('envía la categoría con los nombres del backend', async () => {
    const { repo, http } = crearRepo()

    await repo.crearCategoria({ nombre: 'Documentos', icono: 'file-text', descripcion: 'Cartas', esDestacada: true })

    expect(http.post).toHaveBeenCalledWith('/categories', {
      name: 'Documentos',
      iconName: 'file-text',
      description: 'Cartas',
      isFeatured: true,
    })
  })

  it('explica por qué no se puede eliminar una categoría con guías', async () => {
    const { repo, http } = crearRepo()
    http.delete.mockRejectedValue(
      new AxiosError('fallo', '500', undefined, undefined, { status: 500 } as AxiosResponse),
    )

    await expect(repo.eliminarCategoria('c1')).rejects.toBeInstanceOf(ErrorGestion)
  })
})
