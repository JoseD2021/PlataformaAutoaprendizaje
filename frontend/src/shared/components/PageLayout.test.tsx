import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { Usuario } from '../../features/auth/domain/entities'
import { PageLayout } from './PageLayout'

const { usuarioActual, cerrarSesion } = vi.hoisted(() => ({
  usuarioActual: { value: null as Usuario | null },
  cerrarSesion: vi.fn(),
}))

vi.mock('../../features/auth/presentation/context/AuthContext', () => ({
  useAuth: () => ({ usuario: usuarioActual.value, cerrarSesion }),
}))

function renderizar() {
  render(
    <MemoryRouter>
      <PageLayout>
        <p>Contenido</p>
      </PageLayout>
    </MemoryRouter>,
  )
}

function usuario(rol: Usuario['rol']): Usuario {
  return {
    id: 'u1',
    email: 'ana@clena.es',
    nombreCompleto: 'Ana Pérez',
    rol,
    activo: true,
    versionTerminosPrivacidad: '1.0',
    requiereAceptarTerminosPrivacidad: false,
  }
}

describe('PageLayout', () => {
  afterEach(() => {
    usuarioActual.value = null
    cerrarSesion.mockClear()
  })

  it.each(['personal_clena', 'administrador'] as const)(
    'no muestra «Pedir ayuda» al personal con rol %s',
    (rol) => {
      usuarioActual.value = usuario(rol)
      renderizar()

      expect(screen.getByRole('link', { name: 'Ana' })).toHaveAttribute('href', '/perfil')
      expect(screen.getByRole('link', { name: 'Gestión' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Pedir ayuda' })).not.toBeInTheDocument()
    },
  )

  it('muestra «Pedir ayuda» a los usuarios normales', () => {
    usuarioActual.value = usuario('usuario')
    renderizar()

    expect(screen.getByRole('button', { name: 'Pedir ayuda' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Gestión' })).not.toBeInTheDocument()
  })

  it('muestra «Pedir ayuda» a quien no ha iniciado sesión', () => {
    renderizar()

    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pedir ayuda' })).toBeInTheDocument()
  })
})
