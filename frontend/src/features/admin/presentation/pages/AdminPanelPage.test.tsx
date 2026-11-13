import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { AdminPanelPage } from './AdminPanelPage'
import { httpClient } from '../../../../shared/http/client'
import { guardarTokens, limpiarTokens } from '../../../../shared/http/token-storage'
import { AuthProvider } from '../../../auth/presentation/context/AuthContext'

const ADMIN = { id: 'u1', email: 'admin@clena.local', fullName: 'Admin', role: 'administrador', isActive: true }
const ANA = { id: 'u2', email: 'ana@clena.local', fullName: 'Ana Gómez', role: 'usuario', isActive: true }

const ROLES = [
  { role: 'administrador', name: 'Administrador', rank: 30 },
  { role: 'personal_clena', name: 'Personal de la sala', rank: 20 },
  { role: 'usuario', name: 'Usuario', rank: 10 },
]

/** Responde según la ruta: /users, /roles o, por descarte, el perfil de la sesión. */
function simularBackend(perfil: typeof ADMIN | typeof ANA) {
  vi.spyOn(httpClient, 'get').mockImplementation((url: string) => {
    if (url.startsWith('/users')) {
      return Promise.resolve({ data: { items: [ADMIN, ANA], total: 2, page: 1, limit: 20 } } as AxiosResponse)
    }
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
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/admin" element={<AdminPanelPage />} />
            <Route path="/" element={<div>Inicio</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>,
  )
}

describe('AdminPanelPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    limpiarTokens()
  })

  it('muestra el panel cuando el usuario autenticado es administrador', async () => {
    guardarTokens({ accessToken: 'a', refreshToken: 'r' })
    simularBackend(ADMIN)

    renderizar()

    expect(
      await screen.findByRole('heading', { name: 'Panel de administración' }),
    ).toBeInTheDocument()
  })

  it('redirige al inicio si el usuario autenticado no es administrador', async () => {
    guardarTokens({ accessToken: 'a', refreshToken: 'r' })
    simularBackend(ANA)

    renderizar()

    expect(await screen.findByText('Inicio')).toBeInTheDocument()
  })

  it('redirige al inicio si no hay sesión activa', async () => {
    renderizar()

    expect(await screen.findByText('Inicio')).toBeInTheDocument()
  })

  it('lista los usuarios y bloquea el cambio del rol propio', async () => {
    guardarTokens({ accessToken: 'a', refreshToken: 'r' })
    simularBackend(ADMIN)

    renderizar()

    expect(await screen.findByText('Ana Gómez')).toBeInTheDocument()
    expect(screen.getByLabelText('Rol de Admin')).toBeDisabled()
    expect(screen.getByLabelText('Rol de Ana Gómez')).toBeEnabled()
  })

  it('guarda el nuevo rol de otro usuario y muestra el aviso', async () => {
    guardarTokens({ accessToken: 'a', refreshToken: 'r' })
    simularBackend(ADMIN)
    const patch = vi.spyOn(httpClient, 'patch').mockResolvedValue({ data: undefined } as AxiosResponse)

    renderizar()

    const fila = (await screen.findByText('Ana Gómez')).closest('tr') as HTMLElement
    const boton = within(fila).getByRole('button', { name: /Guardar rol/ })
    expect(boton).toBeDisabled()

    fireEvent.change(within(fila).getByLabelText('Rol de Ana Gómez'), { target: { value: 'personal_clena' } })
    expect(boton).toBeEnabled()
    fireEvent.click(boton)

    expect(await screen.findByText(/ahora es «Personal de la sala»/)).toBeInTheDocument()
    expect(patch).toHaveBeenCalledWith('/users/u2/role', { role: 'personal_clena' })
  })
})