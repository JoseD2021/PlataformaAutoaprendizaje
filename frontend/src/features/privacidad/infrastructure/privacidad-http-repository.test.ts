import { describe, it, expect, vi } from 'vitest'
import type { AxiosInstance, AxiosResponse } from 'axios'
import { PrivacidadHttpRepository } from './privacidad-http-repository'

describe('PrivacidadHttpRepository', () => {
  it('obtiene el aviso de privacidad y traduce los campos del backend', async () => {
    const respuestaBackend = {
      version: '1.0',
      effectiveDate: '2026-11-12',
      title: 'Aviso de privacidad',
      sections: [
        {
          title: 'Datos que recopilamos',
          paragraphs: ['Tu nombre y tu correo electrónico.'],
        },
      ],
    }
    const httpMock = {
      get: vi.fn().mockResolvedValue({ data: respuestaBackend } as AxiosResponse),
    } as unknown as AxiosInstance

    const repo = new PrivacidadHttpRepository(httpMock)
    const terminos = await repo.obtenerTerminos()

    expect(httpMock.get).toHaveBeenCalledWith('/privacy/terms')
    expect(terminos).toEqual({
      version: '1.0',
      fechaVigencia: '2026-11-12',
      titulo: 'Aviso de privacidad',
      secciones: [
        {
          titulo: 'Datos que recopilamos',
          parrafos: ['Tu nombre y tu correo electrónico.'],
        },
      ],
    })
  })
})
