import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { HeroBusqueda } from './HeroBusqueda'

function UbicacionActual() {
  const ubicacion = useLocation()
  return <p>Ubicación: {ubicacion.pathname}{ubicacion.search}</p>
}

function renderizar() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<HeroBusqueda />} />
        <Route path="/buscar" element={<UbicacionActual />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('HeroBusqueda', () => {
  it('navega a la página de resultados con la consulta en la URL', () => {
    renderizar()
    fireEvent.change(screen.getByLabelText('Buscar guías'), {
      target: { value: 'mandar una foto' },
    })
    fireEvent.submit(screen.getByRole('search'))

    expect(screen.getByText('Ubicación: /buscar?q=mandar%20una%20foto')).toBeInTheDocument()
  })

  it('avisa y no navega si la búsqueda es demasiado corta', () => {
    renderizar()
    fireEvent.change(screen.getByLabelText('Buscar guías'), {
      target: { value: 'f' },
    })
    fireEvent.submit(screen.getByRole('search'))

    expect(screen.getByText('Escribe al menos dos letras para buscar.')).toBeInTheDocument()
    expect(screen.queryByText(/Ubicación: /)).not.toBeInTheDocument()
  })

  it('parte con el campo vacío por defecto', () => {
    renderizar()
    expect(screen.getByLabelText('Buscar guías')).toHaveValue('')
  })

  it('recibe un valor inicial para refinar la búsqueda', () => {
    render(
      <MemoryRouter>
        <HeroBusqueda valorInicial="correo" />
      </MemoryRouter>,
    )
    expect(screen.getByLabelText('Buscar guías')).toHaveValue('correo')
  })
})
