import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { GuiaDetallePage } from './GuiaDetallePage'
import { httpClient } from '../../../../shared/http/client'

const guiaBackendMock = {
  id: 'enviar-correo-foto',
  titulo: 'Enviar un correo con una foto',
  categoriaId: 'correo',
  totalPasos: 4,
  minutosEstimados: 3,
  esMasPedida: true,
  pasos: [
    {
      orden: 1,
      tituloCorto: 'Redactar',
      accion: 'Haz clic en el botón Redactar',
      descripcion:
        'Está arriba a la izquierda y tiene un lápiz dibujado. Se abrirá una ventana para escribir tu mensaje.',
      imagenUrl: '/img/paso1.png',
      pieImagen:
        'Ilustración del botón Redactar en la esquina superior izquierda de la pantalla de Gmail',
    },
    {
      orden: 2,
      tituloCorto: 'Para',
      accion: 'Escribe a quién se lo envías',
      descripcion:
        'En el campo Para, escribe el correo de la persona. En Asunto, escribe una frase corta, por ejemplo: Fotos.',
      imagenUrl: '/img/paso2.png',
    },
    {
      orden: 3,
      tituloCorto: 'Adjuntar',
      accion: 'Haz clic en el clip para agregar la foto',
      descripcion:
        'Abajo de la ventana hay un ícono de clip. Haz clic, busca la foto en el computador y presiona Abrir.',
      imagenUrl: '/img/paso3.png',
    },
    {
      orden: 4,
      tituloCorto: 'Enviar',
      accion: 'Haz clic en el botón Enviar',
      descripcion:
        'Es el botón azul de abajo a la izquierda. Verás un aviso que dice que el mensaje fue enviado.',
      imagenUrl: '/img/paso4.png',
    },
  ],
}

function crearError404(): AxiosError {
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

function renderizar(guiaId: string = 'enviar-correo-foto') {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[`/guias/${guiaId}`]}>
        <Routes>
          <Route path="/guias/:id" element={<GuiaDetallePage />} />
          <Route path="/" element={<div>Inicio</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('GuiaDetallePage', () => {
  beforeEach(() => {
    vi.spyOn(httpClient, 'get').mockImplementation(async (url) => {
      if (url === '/guides/enviar-correo-foto') {
        return { data: guiaBackendMock } as AxiosResponse
      }
      throw crearError404()
    })
  })

  it('al abrir la guía muestra solo el primer paso con imagen y aviso de pasos faltantes', async () => {
    renderizar('enviar-correo-foto')

    // Espera a que cargue la guía
    expect(
      await screen.findByRole('heading', { name: 'Enviar un correo con una foto' }),
    ).toBeInTheDocument()

    // Solo el primer paso es visible
    expect(screen.getByText('Paso 1 de 4')).toBeInTheDocument()
    expect(screen.getByText('Faltan 3 pasos')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Haz clic en el botón Redactar' }),
    ).toBeInTheDocument()

    // Imagen con alt descriptivo accesible
    const imagen = screen.getByAltText(
      'Ilustración del botón Redactar en la esquina superior izquierda de la pantalla de Gmail',
    )
    expect(imagen).toBeInTheDocument()
    expect(imagen).toHaveAttribute('src', '/img/paso1.png')

    // El botón Atrás debe estar deshabilitado en el primer paso
    const botonAtras = screen.getByRole('button', { name: /Atrás/i })
    expect(botonAtras).toBeDisabled()

    // El paso 2 no debe mostrarse aún
    expect(
      screen.queryByRole('heading', { name: 'Escribe a quién se lo envías' }),
    ).not.toBeInTheDocument()
  })

  it('permite avanzar al siguiente paso y retroceder con Atrás', async () => {
    renderizar('enviar-correo-foto')

    await screen.findByRole('heading', { name: 'Haz clic en el botón Redactar' })

    const botonSiguiente = screen.getByRole('button', { name: /Siguiente/i })
    const botonAtras = screen.getByRole('button', { name: /Atrás/i })

    // Avanza al paso 2
    fireEvent.click(botonSiguiente)

    expect(screen.getByText('Paso 2 de 4')).toBeInTheDocument()
    expect(screen.getByText('Faltan 2 pasos')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Escribe a quién se lo envías' }),
    ).toBeInTheDocument()
    expect(botonAtras).not.toBeDisabled()

    // Retrocede al paso 1
    fireEvent.click(botonAtras)

    expect(screen.getByText('Paso 1 de 4')).toBeInTheDocument()
    expect(screen.getByText('Faltan 3 pasos')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Haz clic en el botón Redactar' }),
    ).toBeInTheDocument()
    expect(botonAtras).toBeDisabled()
  })

  it('en el último paso reemplaza Siguiente por Finalizar guía y muestra felicitación', async () => {
    renderizar('enviar-correo-foto')

    await screen.findByRole('heading', { name: 'Haz clic en el botón Redactar' })

    // Avanzamos los 4 pasos
    const botonSiguiente = screen.getByRole('button', { name: /Siguiente/i })
    fireEvent.click(botonSiguiente) // Paso 2
    fireEvent.click(botonSiguiente) // Paso 3
    fireEvent.click(botonSiguiente) // Paso 4

    expect(screen.getByText('Paso 4 de 4')).toBeInTheDocument()
    expect(screen.getByText('¡Este es el último paso!')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Haz clic en el botón Enviar' }),
    ).toBeInTheDocument()

    // Ya no hay botón Siguiente; en su lugar está Finalizar guía
    expect(screen.queryByRole('button', { name: /Siguiente/i })).not.toBeInTheDocument()
    const botonFinalizar = screen.getByRole('button', { name: /Finalizar guía/i })
    expect(botonFinalizar).toBeInTheDocument()

    // Al finalizar, muestra pantalla de éxito
    fireEvent.click(botonFinalizar)
    expect(
      screen.getByRole('heading', { name: /¡Felicitaciones! Has completado la guía/i }),
    ).toBeInTheDocument()
  })

  it('cuenta con enlace para volver al inicio y botón para volver a la página anterior', async () => {
    renderizar('enviar-correo-foto')

    const enlaceInicio = await screen.findByRole('link', { name: /Volver al inicio/i })
    expect(enlaceInicio).toHaveAttribute('href', '/')

    const botonVolverAtras = screen.getByRole('button', { name: /Volver a la página anterior/i })
    expect(botonVolverAtras).toBeInTheDocument()
  })

  it('muestra aviso si la guía solicitada no existe', async () => {
    renderizar('guia-inexistente')

    expect(
      await screen.findByText('Esta guía no existe o aún no tiene pasos disponibles.'),
    ).toBeInTheDocument()
  })
})
