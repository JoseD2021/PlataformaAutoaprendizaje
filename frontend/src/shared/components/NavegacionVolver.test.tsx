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
  }
}

const acciones = [
  ['link', 'Usuarios y roles'],
  ['link', 'Gestionar guías y categorías'],
  ['button', 'Gestionar horario'],
  ['button', 'Tratamiento de datos'],
] as const

describe('NavegacionVolver', () => {
  afterEach(() => {
    usuarioActual.value = null
  })

  it('muestra las acciones de administrador en el nav cuando se solicitan', () => {
    usuarioActual.value = usuario('administrador')
    renderizar(true)

    expect(screen.getByRole('link', { name: 'Volver al inicio' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Usuarios y roles' })).toHaveAttribute('href', '/admin')
    expect(screen.getByRole('link', { name: 'Gestionar guías y categorías' })).toHaveAttribute(
      'href',
      '/gestion',
    )
    expect(screen.getByRole('button', { name: 'Gestionar horario' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tratamiento de datos' })).toBeInTheDocument()
  })

  it.each(['personal_clena', 'usuario'] as const)(
    'solo muestra «Volver al inicio» al rol %s',
    (rol) => {
      usuarioActual.value = usuario(rol)
      renderizar(true)

      expect(screen.getByRole('link', { name: 'Volver al inicio' })).toBeInTheDocument()
      for (const [role, name] of acciones) {
        expect(screen.queryByRole(role, { name })).not.toBeInTheDocument()
      }
    },
  )

  it('no muestra acciones de administrador si la página no las solicita', () => {
    usuarioActual.value = usuario('administrador')
    renderizar()

    for (const [role, name] of acciones) {
      expect(screen.queryByRole(role, { name })).not.toBeInTheDocument()
    }
  })
})
