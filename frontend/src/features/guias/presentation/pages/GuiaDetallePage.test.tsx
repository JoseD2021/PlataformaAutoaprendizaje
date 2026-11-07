import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GuiaDetallePage } from './GuiaDetallePage'

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
      screen.getByRole('heading', { name: 'Abre la ventana para escribir' }),
    ).toBeInTheDocument()

    // Imagen con alt descriptivo accesible
    const imagen = screen.getByAltText(
      'Ilustración del botón Redactar en la esquina superior izquierda de la pantalla de Gmail',
    )
    expect(imagen).toBeInTheDocument()
    expect(imagen).toHaveAttribute('src', '/guias/enviar-foto-paso-1.svg')

    // El botón Atrás debe estar deshabilitado en el primer paso
    const botonAtras = screen.getByRole('button', { name: /Atrás/i })
    expect(botonAtras).toBeDisabled()

    // El paso 2 no debe mostrarse aún
    expect(
      screen.queryByRole('heading', { name: 'Escribe a quién se lo mandas y el asunto' }),
    ).not.toBeInTheDocument()
  })

  it('permite avanzar al siguiente paso y retroceder con Atrás', async () => {
    renderizar('enviar-correo-foto')

    await screen.findByRole('heading', { name: 'Abre la ventana para escribir' })

    const botonSiguiente = screen.getByRole('button', { name: /Siguiente/i })
    const botonAtras = screen.getByRole('button', { name: /Atrás/i })

    // Avanza al paso 2
    fireEvent.click(botonSiguiente)

    expect(screen.getByText('Paso 2 de 4')).toBeInTheDocument()
    expect(screen.getByText('Faltan 2 pasos')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Escribe a quién se lo mandas y el asunto' }),
    ).toBeInTheDocument()
    expect(botonAtras).not.toBeDisabled()

    // Retrocede al paso 1
    fireEvent.click(botonAtras)

    expect(screen.getByText('Paso 1 de 4')).toBeInTheDocument()
    expect(screen.getByText('Faltan 3 pasos')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Abre la ventana para escribir' }),
    ).toBeInTheDocument()
    expect(botonAtras).toBeDisabled()
  })

  it('en el último paso reemplaza Siguiente por Finalizar guía y muestra felicitación', async () => {
    renderizar('enviar-correo-foto')

    await screen.findByRole('heading', { name: 'Abre la ventana para escribir' })

    // Avanzamos los 4 pasos
    const botonSiguiente = screen.getByRole('button', { name: /Siguiente/i })
    fireEvent.click(botonSiguiente) // Paso 2
    fireEvent.click(botonSiguiente) // Paso 3
    fireEvent.click(botonSiguiente) // Paso 4

    expect(screen.getByText('Paso 4 de 4')).toBeInTheDocument()
    expect(screen.getByText('¡Este es el último paso!')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Revisa y presiona Enviar' })).toBeInTheDocument()

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
