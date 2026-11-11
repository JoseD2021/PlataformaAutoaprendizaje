import { describe, it, expect, vi } from 'vitest'
import type { AxiosInstance, AxiosResponse } from 'axios'
import { FavoritosHttpRepository } from './favoritos-http-repository'

describe('FavoritosHttpRepository', () => {
  it('listar llama a /favorites y devuelve las guías', async () => {
    const mockFavoritos = [
      {
        id: 'enviar-correo-foto',
        titulo: 'Enviar un correo con una foto',
        categoriaId: 'correo',
        totalPasos: 4,
        minutosEstimados: 3,
        esMasPedida: true,
        etiqueta: 'Recomendada',
      },
    ]
    const httpMock = {
      get: vi.fn().mockResolvedValue({ data: mockFavoritos } as AxiosResponse),
    } as unknown as AxiosInstance

    const repo = new FavoritosHttpRepository(httpMock)
    const resultado = await repo.listar()

    expect(httpMock.get).toHaveBeenCalledWith('/favorites')
    expect(resultado).toEqual(mockFavoritos)
  })

  it('agregar llama a PUT /favorites/:id', async () => {
    const httpMock = {
      put: vi.fn().mockResolvedValue({} as AxiosResponse),
    } as unknown as AxiosInstance
    const repo = new FavoritosHttpRepository(httpMock)

    await repo.agregar('enviar-correo-foto')

    expect(httpMock.put).toHaveBeenCalledWith('/favorites/enviar-correo-foto')
  })

  it('quitar llama a DELETE /favorites/:id', async () => {
    const httpMock = {
      delete: vi.fn().mockResolvedValue({} as AxiosResponse),
    } as unknown as AxiosInstance
    const repo = new FavoritosHttpRepository(httpMock)

    await repo.quitar('enviar-correo-foto')

    expect(httpMock.delete).toHaveBeenCalledWith('/favorites/enviar-correo-foto')
  })
})
