import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { PerfilPage } from './PerfilPage'
import { httpClient } from '../../../../shared/http/client'
import {
  guardarTokens,
  limpiarTokens,
  obtenerTokens,
} from '../../../../shared/http/token-storage'
import { AuthProvider } from '../context/AuthContext'

function renderizar() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <AuthProvider>
        <MemoryRouter initialEntries={['/perfil']}>
          <Routes>
            <Route path="/perfil" element={<PerfilPage />} />
            <Route path="/login" element={<p>Inicio de sesión</p>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>,
  )
}

function crearError(mensaje: string): AxiosError {
  const error = new AxiosError('Error', 'ERR_BAD_REQUEST')
  error.response = {
    status: 400,
    statusText: 'Bad Request',
    data: { error: { message: mensaje } },
    headers: {},
    config: {} as InternalAxiosRequestConfig,
  }
  return error
}

async function esperarFormulario() {
  await screen.findByLabelText('Nombre completo')
}

describe('PerfilPage', () => {
  beforeEach(() => {
    guardarTokens({ accessToken: 'a', refreshToken: 'r' })
    vi.spyOn(httpClient, 'get').mockResolvedValue({
      data: {
        id: 'u1',
        email: 'ana@clena.local',
        fullName: 'Ana Pérez',
        role: 'usuario',
        isActive: true,
      },
    } as AxiosResponse)
  })

  afterEach(() => {
    limpiarTokens()
    vi.restoreAllMocks()
  })

  it('cambia el nombre con PATCH /auth/me/name y actualiza el encabezado', async () => {
    const patch = vi.spyOn(httpClient, 'patch').mockResolvedValue({ data: undefined } as AxiosResponse)
    renderizar()
    await esperarFormulario()

    fireEvent.change(screen.getByLabelText('Nombre completo'), {
      target: { value: 'Marta Pérez' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar nombre' }))

    await waitFor(() =>
      expect(patch).toHaveBeenCalledWith('/auth/me/name', { fullName: 'Marta Pérez' }),
    )
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Tu nombre se actualizó correctamente.',
    )
    expect(screen.getByRole('link', { name: 'Marta' })).toHaveAttribute('href', '/perfil')
  })

  it('muestra el error del servidor al cambiar el nombre', async () => {
    vi.spyOn(httpClient, 'patch').mockRejectedValue(
      crearError('El nombre debe tener entre 2 y 120 caracteres.'),
    )
    renderizar()
    await esperarFormulario()

    fireEvent.change(screen.getByLabelText('Nombre completo'), {
      target: { value: 'A' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar nombre' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'El nombre debe tener entre 2 y 120 caracteres.',
    )
  })

  it('cambia la contraseña con PATCH /auth/me/password y pide iniciar sesión de nuevo', async () => {
    const patch = vi.spyOn(httpClient, 'patch').mockResolvedValue({ data: undefined } as AxiosResponse)
    renderizar()
    await esperarFormulario()

    fireEvent.change(screen.getByLabelText('Contraseña actual'), {
      target: { value: 'ClaveActual123' },
    })
    fireEvent.change(screen.getByLabelText('Nueva contraseña'), {
      target: { value: 'ClaveNueva123' },
    })
    fireEvent.change(screen.getByLabelText('Repite la nueva contraseña'), {
      target: { value: 'ClaveNueva123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Cambiar contraseña' }))

    await waitFor(() =>
      expect(patch).toHaveBeenCalledWith('/auth/me/password', {
        currentPassword: 'ClaveActual123',
        newPassword: 'ClaveNueva123',
      }),
    )
    expect(await screen.findByText('Contraseña actualizada')).toBeInTheDocument()
    expect(within(screen.getByRole('main')).getByRole('link', { name: 'Iniciar sesión' })).toHaveAttribute(
      'href',
      '/login',
    )
    expect(obtenerTokens()).toBeNull()
  })

  it('no llama al servidor si las contraseñas nuevas no coinciden', async () => {
    const patch = vi.spyOn(httpClient, 'patch').mockResolvedValue({ data: undefined } as AxiosResponse)
    renderizar()
    await esperarFormulario()

    fireEvent.change(screen.getByLabelText('Contraseña actual'), {
      target: { value: 'ClaveActual123' },
    })
    fireEvent.change(screen.getByLabelText('Nueva contraseña'), {
      target: { value: 'ClaveNueva123' },
    })
    fireEvent.change(screen.getByLabelText('Repite la nueva contraseña'), {
      target: { value: 'OtraClave123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Cambiar contraseña' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Las contraseñas nuevas no coinciden.',
    )
    expect(patch).not.toHaveBeenCalled()
  })

  it('abre el modal de confirmación y cancela sin llamar al servidor', async () => {
    const borrar = vi.spyOn(httpClient, 'delete').mockResolvedValue({ data: undefined } as AxiosResponse)
    renderizar()
    await esperarFormulario()

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar mi cuenta' }))

    const modal = await screen.findByRole('alertdialog')
    expect(modal).toHaveAttribute('open')
    expect(borrar).not.toHaveBeenCalled()

    fireEvent.click(within(modal).getByRole('button', { name: 'Cancelar' }))

    expect(modal).not.toHaveAttribute('open')
    expect(borrar).not.toHaveBeenCalled()
  })

  it('elimina la cuenta tras confirmar y cierra la sesión', async () => {
    const borrar = vi.spyOn(httpClient, 'delete').mockResolvedValue({ data: undefined } as AxiosResponse)
    renderizar()
    await esperarFormulario()

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar mi cuenta' }))
    const modal = await screen.findByRole('alertdialog')
    fireEvent.click(within(modal).getByRole('button', { name: 'Sí, eliminar mi cuenta' }))

    await waitFor(() => expect(borrar).toHaveBeenCalledWith('/auth/me'))
    expect(await screen.findByText('Inicio de sesión')).toBeInTheDocument()
    expect(obtenerTokens()).toBeNull()
  })

  it('muestra el error del servidor y mantiene abierto el modal', async () => {
    vi.spyOn(httpClient, 'delete').mockRejectedValue(
      crearError('No se pudo eliminar la cuenta.'),
    )
    renderizar()
    await esperarFormulario()

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar mi cuenta' }))
    const modal = await screen.findByRole('alertdialog')
    fireEvent.click(within(modal).getByRole('button', { name: 'Sí, eliminar mi cuenta' }))

    expect(await within(modal).findByRole('alert')).toHaveTextContent(
      'No se pudo eliminar la cuenta.',
    )
    expect(modal).toHaveAttribute('open')
    expect(screen.getByRole('button', { name: 'Eliminar mi cuenta' })).toBeInTheDocument()
  })
})
