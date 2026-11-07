import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { GuiaItem } from './GuiaItem'
import type { GuiaResumen } from '../../domain/entities'

const guiaPrueba: GuiaResumen = {
  id: 'enviar-correo-foto',
  titulo: 'Enviar un correo con una foto',
  categoriaId: 'correo',
  totalPasos: 4,
  minutosEstimados: 3,
  esMasPedida: true,
  etiqueta: 'Recomendado',
}

describe('GuiaItem', () => {
  it('enlaza hacia la ruta /guias/:id con sus metadatos y etiquetas', () => {
    render(
      <MemoryRouter>
        <GuiaItem guia={guiaPrueba} />
      </MemoryRouter>,
    )

    const enlace = screen.getByRole('link', { name: /Enviar un correo con una foto/i })
    expect(enlace).toHaveAttribute('href', '/guias/enviar-correo-foto')
    expect(screen.getByText('4 pasos · 3 minutos')).toBeInTheDocument()
    expect(screen.getByText('La más pedida')).toBeInTheDocument()
    expect(screen.getByText('Recomendado')).toBeInTheDocument()
  })
})
