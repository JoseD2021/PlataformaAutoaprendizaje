import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { AxiosResponse } from 'axios'
import { AdminPanelPage } from './AdminPanelPage'
import { httpClient } from '../../../../shared/http/client'
import { guardarTokens, limpiarTokens } from '../../../../shared/http/token-storage'
import { AuthProvider } from '../../../auth/presentation/context/AuthContext'

function renderizar() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<AdminPanelPage />} />
          <Route path="/" element={<div>Inicio</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  )
}

describe('AdminPanelPage', () => {
  beforeEach(() => {
    limpiarTokens()
  })

  it('muestra el panel cuando el usuario autenticado es administrador', async () => {
    guardarTokens({ accessToken: 'a', refreshToken: 'r' })
    vi.spyOn(httpClient, 'get').mockResolvedValue({
      data: {
        id: 'u1',
        email: 'admin@clena.local',
        fullName: 'Admin',
        role: 'administrador',
        isActive: true,
      },
    } as AxiosResponse)

    renderizar()

    expect(
      await screen.findByRole('heading', { name: 'Panel de administración' }),
    ).toBeInTheDocument()
  })

  it('redirige al inicio si el usuario autenticado no es administrador', async () => {
    guardarTokens({ accessToken: 'a', refreshToken: 'r' })
    vi.spyOn(httpClient, 'get').mockResolvedValue({
      data: {
        id: 'u2',
        email: 'ana@clena.local',
        fullName: 'Ana',
        role: 'usuario',
        isActive: true,
      },
    } as AxiosResponse)

    renderizar()

    expect(await screen.findByText('Inicio')).toBeInTheDocument()
  })

  it('redirige al inicio si no hay sesión activa', async () => {
    renderizar()

    expect(await screen.findByText('Inicio')).toBeInTheDocument()
  })
})
