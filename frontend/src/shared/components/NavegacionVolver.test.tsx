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

const accionesAdmin = [
  ['link', 'Gestionar usuarios'],
  ['link', 'Horario de la sala'],
  ['link', 'Gestionar roles'],
  ['link', 'Tratamiento de datos'],
] as const

const todasLasAcciones = [
  ...accionesAdmin,
  ['link', 'Guías y categorías'],
  ['link', 'Dudas sin guía'],
] as const

describe('NavegacionVolver', () => {
  afterEach(() => {
    usuarioActual.value = null
  })

  it('muestra las acciones según los permisos del usuario', () => {
    usuarioActual.value = usuario([
      'doubts:manage',
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
    expect(screen.getByRole('link', { name: 'Dudas sin guía' })).toHaveAttribute('href', '/dudas')
  })

  it('solo muestra las acciones para las que hay permiso', () => {
    usuarioActual.value = usuario(['roles:read'])
    renderizar(true)

    expect(screen.getByRole('link', { name: 'Gestionar roles' })).toHaveAttribute('href', '/roles')
    for (const [role, name] of todasLasAcciones) {
      if (name === 'Gestionar roles') continue
      expect(screen.queryByRole(role, { name })).not.toBeInTheDocument()
    }
  })

  it('muestra «Dudas sin guía» sin acciones de administrador', () => {
    usuarioActual.value = usuario(['doubts:manage'])
    renderizar(true)

    expect(screen.getByRole('link', { name: 'Dudas sin guía' })).toHaveAttribute('href', '/dudas')
    for (const [role, name] of accionesAdmin) {
      expect(screen.queryByRole(role, { name })).not.toBeInTheDocument()
    }
  })

  it('no muestra «Dudas sin guía» a un usuario sin permiso', () => {
    usuarioActual.value = usuario(['favorites:manage', 'help-requests:create'])
    renderizar(true)

    expect(screen.queryByRole('link', { name: 'Dudas sin guía' })).not.toBeInTheDocument()
  })

  it('muestra «Dudas sin guía» aunque la página no solicite acciones de administrador', () => {
    usuarioActual.value = usuario(['users:read', 'roles:read', 'doubts:manage'])
    renderizar()

    for (const [role, name] of accionesAdmin) {
      expect(screen.queryByRole(role, { name })).not.toBeInTheDocument()
    }
    expect(screen.getByRole('link', { name: 'Dudas sin guía' })).toHaveAttribute('href', '/dudas')
  })
})
