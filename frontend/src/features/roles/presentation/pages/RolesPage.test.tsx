import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { RolesPage } from './RolesPage'
import { httpClient } from '../../../../shared/http/client'
import { guardarTokens, limpiarTokens } from '../../../../shared/http/token-storage'
import { AuthProvider } from '../../../auth/presentation/context/AuthContext'
import { PERMISOS } from '../../domain/permisos'

const ADMIN = {
  id: 'u1',
  email: 'admin@clena.local',
  fullName: 'Admin',
  role: 'administrador',
  roleRank: 30,
  permissions: PERMISOS.map((permiso) => permiso.valor),
  isActive: true,
}
const ANA = {
  id: 'u2',
  email: 'ana@clena.local',
  fullName: 'Ana',
  role: 'usuario',
  roleRank: 10,
  permissions: ['favorites:manage', 'help-requests:create'],
  isActive: true,
}

const ROLES = [
  { role: 'administrador', name: 'Administrador', rank: 30, permissions: PERMISOS.map((p) => p.valor) },
  { role: 'personal_clena', name: 'Personal de la sala', rank: 20, permissions: ['users:read', 'guides:manage'] },
  { role: 'usuario', name: 'Usuario', rank: 10, permissions: ['favorites:manage'] },
]

function simularBackend(perfil: typeof ADMIN | typeof ANA) {
  vi.spyOn(httpClient, 'get').mockImplementation((url: string) => {
    if (url.startsWith('/roles')) {
      return Promise.resolve({ data: ROLES } as AxiosResponse)
    }
    return Promise.resolve({ data: perfil } as AxiosResponse)
  })
}

function renderizar() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <AuthProvider>
        <MemoryRouter initialEntries={['/roles']}>
          <Routes>
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/" element={<div>Inicio</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>,
  )
}

describe('RolesPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    limpiarTokens()
  })

  afterEach(() => {
    limpiarTokens()
  })

  it('muestra la página y los roles a quien tiene permiso para verlos', async () => {
    guardarTokens({ accessToken: 'a', refreshToken: 'r' })
    simularBackend(ADMIN)

    renderizar()

    expect(await screen.findByRole('heading', { name: 'Roles y permisos' })).toBeInTheDocument()
    expect(screen.getByText('Personal de la sala')).toBeInTheDocument()
  })

  it('redirige al inicio si el usuario no tiene el permiso', async () => {
    guardarTokens({ accessToken: 'a', refreshToken: 'r' })
    simularBackend(ANA)

    renderizar()

    expect(await screen.findByText('Inicio')).toBeInTheDocument()
  })

  it('crea un rol con los permisos seleccionados', async () => {
    guardarTokens({ accessToken: 'a', refreshToken: 'r' })
    simularBackend(ADMIN)
    const post = vi.spyOn(httpClient, 'post').mockResolvedValue({
      data: { role: 'colaborador', name: 'Colaborador', rank: 25, permissions: ['guides:manage'] },
    } as AxiosResponse)

    renderizar()
    await screen.findByRole('heading', { name: 'Roles y permisos' })

    fireEvent.change(screen.getByLabelText('Identificador'), { target: { value: 'colaborador' } })
    fireEvent.change(screen.getByLabelText('Nombre visible'), { target: { value: 'Colaborador' } })
    fireEvent.change(screen.getByLabelText('Rango'), { target: { value: '25' } })
    fireEvent.click(screen.getByLabelText('Gestionar guías'))
    fireEvent.click(screen.getByRole('button', { name: 'Crear rol' }))

    expect(post).toHaveBeenCalledWith('/roles', {
      role: 'colaborador',
      name: 'Colaborador',
      rank: 25,
      permissions: ['guides:manage'],
    })
    expect(await screen.findByText('Rol «Colaborador» creado correctamente.')).toBeInTheDocument()
  })

  it('guarda los permisos modificados de un rol inferior', async () => {
    guardarTokens({ accessToken: 'a', refreshToken: 'r' })
    simularBackend(ADMIN)
    const patch = vi.spyOn(httpClient, 'patch').mockResolvedValue({ data: ROLES[1] } as AxiosResponse)

    renderizar()
    const resumen = await screen.findByText('Personal de la sala')
    fireEvent.click(resumen)
    const detalles = resumen.closest('details') as HTMLElement

    fireEvent.click(within(detalles).getByLabelText('Gestionar guías'))
    fireEvent.click(within(detalles).getByLabelText('Crear guías'))
    fireEvent.click(within(detalles).getByRole('button', { name: 'Guardar permisos' }))

    expect(patch).toHaveBeenCalledWith('/roles/personal_clena/permissions', {
      permissions: ['users:read', 'guides:create'],
    })
    expect(await screen.findByText('Permisos de «Personal de la sala» actualizados.')).toBeInTheDocument()
  })

  it('deshabilita permisos que exigen un rango superior al del rol', async () => {
    guardarTokens({ accessToken: 'a', refreshToken: 'r' })
    simularBackend(ADMIN)

    renderizar()
    const resumen = await screen.findByText('Usuario')
    fireEvent.click(resumen)
    const detalles = resumen.closest('details') as HTMLElement

    expect(within(detalles).getByLabelText('Crear usuarios')).toBeDisabled()
    expect(within(detalles).getByLabelText('Enviar solicitudes de ayuda')).toBeEnabled()
  })

  it('no permite cambiar los permisos del rol con igual jerarquía', async () => {
    guardarTokens({ accessToken: 'a', refreshToken: 'r' })
    simularBackend(ADMIN)

    renderizar()
    const resumen = await screen.findByText('Administrador')
    fireEvent.click(resumen)
    const detalles = resumen.closest('details') as HTMLElement

    expect(within(detalles).getByLabelText('Crear usuarios')).toBeDisabled()
    expect(within(detalles).getByRole('button', { name: 'Guardar permisos' })).toBeDisabled()
  })
})
