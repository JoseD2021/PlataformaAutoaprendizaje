import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { Usuario } from '../../features/auth/domain/entities'
import { PERMISOS_GESTION, type Permiso } from '../permisos'
import { NavegacionVolver } from './NavegacionVolver'

const { usuarioActual } = vi.hoisted(() => ({
  usuarioActual: { value: null as Usuario | null },
}))

vi.mock('../../features/auth/presentation/context/AuthContext', () => ({
  useAuth: () => ({ usuario: usuarioActual.value }),
}))

function renderizar(conAccionesAdmin = false) {
  render(
    <MemoryRouter>
      <NavegacionVolver conAtras={false} conAccionesAdmin={conAccionesAdmin} />
    </MemoryRouter>,
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

const acciones = [
  ['link', 'Gestionar usuarios'],
  ['link', 'Guías y categorías'],
  ['link', 'Horario de la sala'],
  ['link', 'Gestionar roles'],
  ['link', 'Tratamiento de datos'],
] as const

describe('NavegacionVolver', () => {
  afterEach(() => {
    usuarioActual.value = null
  })

  it('muestra las acciones según los permisos del usuario', () => {
    usuarioActual.value = usuario([
      'users:read',
      ...PERMISOS_GESTION,
      'room-info:manage',
      'roles:read',
      'privacy-terms:manage',
    ])
    renderizar(true)

    expect(screen.getByRole('link', { name: 'Volver al inicio' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Gestionar usuarios' })).toHaveAttribute('href', '/admin')
    expect(screen.getByRole('link', { name: 'Guías y categorías' })).toHaveAttribute('href', '/gestion')
    expect(screen.getByRole('link', { name: 'Horario de la sala' })).toHaveAttribute('href', '/horario')
    expect(screen.getByRole('link', { name: 'Gestionar roles' })).toHaveAttribute('href', '/roles')
    expect(screen.getByRole('link', { name: 'Tratamiento de datos' })).toHaveAttribute('href', '/privacidad')
  })

  it('solo muestra las acciones para las que hay permiso', () => {
    usuarioActual.value = usuario(['roles:read'])
    renderizar(true)

    expect(screen.getByRole('link', { name: 'Gestionar roles' })).toBeInTheDocument()
    for (const [role, name] of acciones) {
      if (name === 'Gestionar roles') continue
      expect(screen.queryByRole(role, { name })).not.toBeInTheDocument()
    }
  })

  it('no muestra acciones si la página no las solicita', () => {
    usuarioActual.value = usuario(['users:read', 'roles:read'])
    renderizar()

    for (const [role, name] of acciones) {
      expect(screen.queryByRole(role, { name })).not.toBeInTheDocument()
    }
  })
})
