import { describe, it, expect, vi } from 'vitest'
import type { AxiosInstance, AxiosResponse } from 'axios'
import { AyudaHttpRepository } from './ayuda-http-repository'

const dto = {
  id: 'h1',
  puesto: 5,
  guiaId: 'enviar-correo-foto',
  guiaTitulo: 'Enviar un correo con una foto',
  paso: 2,
  solicitante: null,
  estado: 'pending',
  creadaEn: '2026-11-26T15:00:00.000Z',
}

const esperado = {
  id: 'h1',
  puesto: 5,
  guiaId: 'enviar-correo-foto',
  guiaTitulo: 'Enviar un correo con una foto',
  paso: 2,
  solicitante: null,
  creadaEn: '2026-11-26T15:00:00.000Z',
}

describe('AyudaHttpRepository', () => {
  it('pedir hace POST /help-requests con el puesto, la guía y el paso', async () => {
    const httpMock = {
      post: vi.fn().mockResolvedValue({ data: dto } as AxiosResponse),
    } as unknown as AxiosInstance

    const resultado = await new AyudaHttpRepository(httpMock).pedir({
      puesto: 5,
      guiaId: 'enviar-correo-foto',
      paso: 2,
    })

    expect(httpMock.post).toHaveBeenCalledWith('/help-requests', {
      puesto: 5,
      guiaId: 'enviar-correo-foto',
      paso: 2,
    })
    expect(resultado).toEqual(esperado)
  })

  it('listarPendientes hace GET /help-requests/pending', async () => {
    const httpMock = {
      get: vi.fn().mockResolvedValue({ data: [dto] } as AxiosResponse),
    } as unknown as AxiosInstance

    const resultado = await new AyudaHttpRepository(httpMock).listarPendientes()

    expect(httpMock.get).toHaveBeenCalledWith('/help-requests/pending')
    expect(resultado).toEqual([esperado])
  })

  it('marcarAtendida hace PATCH /help-requests/:id/resolve', async () => {
    const httpMock = {
      patch: vi.fn().mockResolvedValue({} as AxiosResponse),
    } as unknown as AxiosInstance

    await new AyudaHttpRepository(httpMock).marcarAtendida('h1')

    expect(httpMock.patch).toHaveBeenCalledWith('/help-requests/h1/resolve')
  })
})
