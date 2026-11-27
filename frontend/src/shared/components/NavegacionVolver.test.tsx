import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { Usuario } from '../../features/auth/domain/entities'
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

const accionesAdmin = [
  ['link', 'Gestionar usuarios'],
  ['link', 'Horario de la sala'],
  ['button', 'Gestionar roles'],
  ['link', 'Tratamiento de datos'],
] as const

describe('NavegacionVolver', () => {
  afterEach(() => {
    usuarioActual.value = null
  })

  it('muestra las acciones de administrador en el nav cuando se solicitan', () => {
    usuarioActual.value = usuario('administrador')
    renderizar(true)

    expect(screen.getByRole('link', { name: 'Volver al inicio' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Gestionar usuarios' })).toHaveAttribute('href', '/admin')
    expect(screen.getByRole('link', { name: 'Guías y categorías' })).toHaveAttribute('href', '/gestion')
    expect(screen.getByRole('link', { name: 'Horario de la sala' })).toHaveAttribute('href', '/horario')
    expect(screen.getByRole('button', { name: 'Gestionar roles' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Tratamiento de datos' })).toHaveAttribute('href', '/privacidad')
    expect(screen.getByRole('link', { name: 'Dudas sin guía' })).toHaveAttribute('href', '/dudas')
  })

  it('muestra «Dudas sin guía» al personal y no las acciones de administrador', () => {
    usuarioActual.value = usuario('personal_clena')
    renderizar(true)

    expect(screen.getByRole('link', { name: 'Guías y categorías' })).toHaveAttribute('href', '/gestion')
    expect(screen.getByRole('link', { name: 'Dudas sin guía' })).toHaveAttribute('href', '/dudas')
    for (const [role, name] of accionesAdmin) {
      expect(screen.queryByRole(role, { name })).not.toBeInTheDocument()
    }
  })

  it('no muestra «Dudas sin guía» ni las acciones de administrador a un usuario común', () => {
    usuarioActual.value = usuario('usuario')
    renderizar(true)

    expect(screen.getByRole('link', { name: 'Guías y categorías' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Dudas sin guía' })).not.toBeInTheDocument()
    for (const [role, name] of accionesAdmin) {
      expect(screen.queryByRole(role, { name })).not.toBeInTheDocument()
    }
  })

  it('no muestra acciones de administrador si la página no las solicita', () => {
    usuarioActual.value = usuario('administrador')
    renderizar()

    for (const [role, name] of accionesAdmin) {
      expect(screen.queryByRole(role, { name })).not.toBeInTheDocument()
    }
    expect(screen.getByRole('link', { name: 'Dudas sin guía' })).toBeInTheDocument()
  })
})
