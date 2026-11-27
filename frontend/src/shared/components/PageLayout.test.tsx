import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Usuario } from '../../features/auth/domain/entities'
import type { Permiso } from '../../shared/permisos'
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
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <PageLayout>
          <p>Contenido</p>
        </PageLayout>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

function usuario(permisos: Permiso[] = []): Usuario {
  return {
    id: 'u1',
    email: 'ana@clena.es',
    nombreCompleto: 'Ana Pérez',
    rol: 'colaborador',
    rango: 20,
    permisos,
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

  it('muestra gestión y oculta «Pedir ayuda» a quien puede ver solicitudes', () => {
    usuarioActual.value = usuario(['help-requests:read', 'guides:manage'])
    renderizar()

    expect(screen.getByRole('link', { name: 'Ana' })).toHaveAttribute('href', '/perfil')
    expect(screen.getByRole('link', { name: 'Gestión' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Pedir ayuda' })).not.toBeInTheDocument()
  })

  it('muestra «Pedir ayuda» y oculta gestión a quien solo tiene permisos de usuario', () => {
    usuarioActual.value = usuario(['favorites:manage', 'help-requests:create'])
    renderizar()

    expect(screen.getByRole('button', { name: 'Pedir ayuda' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Gestión' })).not.toBeInTheDocument()
  })

  it('muestra gestión según permisos aunque el rol no sea uno de los base', () => {
    usuarioActual.value = usuario(['categories:create'])
    renderizar()

    expect(screen.getByRole('link', { name: 'Gestión' })).toBeInTheDocument()
  })

  it('muestra «Pedir ayuda» a quien no ha iniciado sesión', () => {
    renderizar()

    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pedir ayuda' })).toBeInTheDocument()
  })
})
