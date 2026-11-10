import { describe, it, expect, vi } from 'vitest'
import axios, { AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { GuiasHttpRepository } from './guias-http-repository'

function crearAxiosError404(): AxiosError {
  const error = new AxiosError('Not Found', 'ERR_BAD_REQUEST')
  error.response = {
    status: 404,
    statusText: 'Not Found',
    data: { message: 'Guía no encontrada' },
    headers: {},
    config: {} as InternalAxiosRequestConfig,
  }
  return error
}

describe('GuiasHttpRepository', () => {
  it('listarCategorias llama a /categories y mapea los campos', async () => {
    const mockCategorias = [
      {
        id: 'cat-1',
        name: 'Correo Gmail',
        slug: 'correo-gmail',
        iconName: 'mail',
        description: 'Entrar a tu correo...',
        isFeatured: true,
      },
    ]

    const httpMock = {
      get: vi.fn().mockResolvedValue({ data: mockCategorias } as AxiosResponse),
    } as unknown as AxiosInstance

    const repo = new GuiasHttpRepository(httpMock)
    const resultado = await repo.listarCategorias()

    expect(httpMock.get).toHaveBeenCalledWith('/categories')
    expect(resultado).toEqual([
      {
        id: 'cat-1',
        nombre: 'Correo Gmail',
        descripcion: 'Entrar a tu correo...',
        icono: 'mail',
        esDestacada: true,
        slug: 'correo-gmail',
      },
    ])
  })

  it('obtenerCategoria busca la categoría por id o por slug', async () => {
    const mockCategorias = [
      {
        id: 'uuid-1',
        name: 'Correo Gmail',
        slug: 'correo-gmail',
        iconName: 'mail',
        description: 'Entrar a tu correo...',
        isFeatured: true,
      },
    ]

    const httpMock = {
      get: vi.fn().mockResolvedValue({ data: mockCategorias } as AxiosResponse),
    } as unknown as AxiosInstance

    const repo = new GuiasHttpRepository(httpMock)

    // Por id
    const porId = await repo.obtenerCategoria('uuid-1')
    expect(porId?.nombre).toBe('Correo Gmail')

    // Por slug
    const porSlug = await repo.obtenerCategoria('correo-gmail')
    expect(porSlug?.nombre).toBe('Correo Gmail')

    // Inexistente
    const inexistente = await repo.obtenerCategoria('no-existe')
    expect(inexistente).toBeNull()
  })

  it('listarGuiasPorCategoria llama a /guides con categoriaId y devuelve los items', async () => {
    const mockRespuesta = {
      items: [
        {
          id: 'enviar-correo-foto',
          titulo: 'Enviar un correo con una foto',
          categoriaId: 'cat-1',
          totalPasos: 4,
          minutosEstimados: 3,
          esMasPedida: true,
          etiqueta: 'Recomendada',
        },
      ],
      total: 1,
      page: 1,
      limit: 100,
    }

    const httpMock = {
      get: vi.fn().mockResolvedValue({ data: mockRespuesta } as AxiosResponse),
    } as unknown as AxiosInstance

    const repo = new GuiasHttpRepository(httpMock)
    const resultado = await repo.listarGuiasPorCategoria('cat-1')

    expect(httpMock.get).toHaveBeenCalledWith('/guides', {
      params: { categoriaId: 'cat-1', limit: 100 },
    })
    expect(resultado).toEqual(mockRespuesta.items)
  })

  it('obtenerGuia llama a /guides/:id y mapea los pasos', async () => {
    const mockGuia = {
      id: 'enviar-correo-foto',
      titulo: 'Enviar un correo con una foto',
      categoriaId: 'cat-1',
      totalPasos: 1,
      minutosEstimados: 3,
      esMasPedida: true,
      pasos: [
        {
          orden: 1,
          tituloCorto: 'Redactar',
          accion: 'Haz clic en el botón Redactar',
          descripcion: 'Está arriba a la izquierda.',
          imagenUrl: '/img/paso1.png',
          pieImagen: 'Botón redactar',
        },
      ],
    }

    const httpMock = {
      get: vi.fn().mockResolvedValue({ data: mockGuia } as AxiosResponse),
    } as unknown as AxiosInstance

    const repo = new GuiasHttpRepository(httpMock)
    const resultado = await repo.obtenerGuia('enviar-correo-foto')

    expect(httpMock.get).toHaveBeenCalledWith('/guides/enviar-correo-foto')
    expect(resultado).toEqual({
      id: 'enviar-correo-foto',
      titulo: 'Enviar un correo con una foto',
      categoriaId: 'cat-1',
      totalPasos: 1,
      minutosEstimados: 3,
      esMasPedida: true,
      etiqueta: undefined,
      pasos: [
        {
          id: '1',
          numero: 1,
          titulo: 'Haz clic en el botón Redactar',
          texto: 'Está arriba a la izquierda.',
          imagenUrl: '/img/paso1.png',
          imagenAlt: 'Botón redactar',
        },
      ],
    })
  })

  it('obtenerGuia usa la imagen notfound si el backend no envía imagenUrl', async () => {
    const mockGuia = {
      id: 'enviar-correo-foto',
      titulo: 'Enviar un correo con una foto',
      categoriaId: 'cat-1',
      totalPasos: 1,
      minutosEstimados: 3,
      esMasPedida: false,
      pasos: [
        {
          orden: 1,
          tituloCorto: 'Redactar',
          accion: 'Haz clic en el botón Redactar',
          descripcion: 'Está arriba a la izquierda.',
        },
      ],
    }

    const httpMock = {
      get: vi.fn().mockResolvedValue({ data: mockGuia } as AxiosResponse),
    } as unknown as AxiosInstance

    const repo = new GuiasHttpRepository(httpMock)
    const resultado = await repo.obtenerGuia('enviar-correo-foto')

    expect(resultado?.pasos[0].imagenUrl).toBe('/svg/notfound.svg')
    expect(resultado?.pasos[0].imagenAlt).toBe('Ilustración del paso 1: Haz clic en el botón Redactar')
  })

  it('buscarGuias llama a /guides/search y mapea los campos del backend', async () => {
    const mockRespuesta = {
      items: [
        {
          id: 'enviar-correo-foto',
          title: 'Enviar un correo con una foto',
          estimatedMinutes: 3,
          categoryName: 'Correo',
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    }

    const httpMock = {
      get: vi.fn().mockResolvedValue({ data: mockRespuesta } as AxiosResponse),
    } as unknown as AxiosInstance

    const repo = new GuiasHttpRepository(httpMock)
    const resultado = await repo.buscarGuias('mandar foto', 1, 10)

    expect(httpMock.get).toHaveBeenCalledWith('/guides/search', {
      params: { q: 'mandar foto', page: 1, limit: 10 },
    })
    expect(resultado).toEqual({
      items: [
        {
          id: 'enviar-correo-foto',
          titulo: 'Enviar un correo con una foto',
          minutosEstimados: 3,
          nombreCategoria: 'Correo',
        },
      ],
      total: 1,
      pagina: 1,
      totalPaginas: 1,
    })
  })

  it('buscarGuias devuelve una página vacía si la API responde 400', async () => {
    const error400 = new AxiosError('Bad Request', 'ERR_BAD_REQUEST')
    error400.response = {
      status: 400,
      statusText: 'Bad Request',
      data: { message: 'La búsqueda no contiene palabras válidas' },
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    }
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

    const httpMock = {
      get: vi.fn().mockRejectedValue(error400),
    } as unknown as AxiosInstance

    const repo = new GuiasHttpRepository(httpMock)
    const resultado = await repo.buscarGuias('de la', 1, 10)

    expect(resultado).toEqual({ items: [], total: 0, pagina: 1, totalPaginas: 0 })
  })

  it('buscarGuias relanza el error si no es 400', async () => {
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(false)
    const error500 = new Error('Error de servidor')

    const httpMock = {
      get: vi.fn().mockRejectedValue(error500),
    } as unknown as AxiosInstance

    const repo = new GuiasHttpRepository(httpMock)

    await expect(repo.buscarGuias('foto', 1, 10)).rejects.toThrow('Error de servidor')
  })

  it('obtenerGuia devuelve null si la API responde 404', async () => {
    const error404 = crearAxiosError404()
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

    const httpMock = {
      get: vi.fn().mockRejectedValue(error404),
    } as unknown as AxiosInstance

    const repo = new GuiasHttpRepository(httpMock)
    const resultado = await repo.obtenerGuia('guia-inexistente')

    expect(resultado).toBeNull()
  })

  it('obtenerGuia relanza el error si no es 404', async () => {
    const error500 = new Error('Error de servidor')

    const httpMock = {
      get: vi.fn().mockRejectedValue(error500),
    } as unknown as AxiosInstance

    const repo = new GuiasHttpRepository(httpMock)

    await expect(repo.obtenerGuia('error-500')).rejects.toThrow('Error de servidor')
  })
})
