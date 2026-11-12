import { describe, expect, it, vi } from 'vitest'
import type { AxiosInstance } from 'axios'
import { AdminHttpRepository } from './admin-http-repository'

function crearRepo(data: unknown = undefined) {
  const http = {
    get: vi.fn().mockResolvedValue({ data }),
    patch: vi.fn().mockResolvedValue({ data }),
  }
  return { http, repo: new AdminHttpRepository(http as unknown as AxiosInstance) }
}

describe('AdminHttpRepository', () => {
  it('traduce los usuarios del backend y conserva la paginación', async () => {
    const { repo, http } = crearRepo({
      items: [{ id: 'u1', email: 'm@clena.local', fullName: 'María Pérez', role: 'usuario', isActive: true }],
      total: 42,
      page: 2,
      limit: 20,
    })

    const pagina = await repo.listarUsuarios(2, 20)

    expect(http.get).toHaveBeenCalledWith('/users', { params: { page: 2, limit: 20 } })
    expect(pagina.items[0]).toEqual({
      id: 'u1',
      email: 'm@clena.local',
      nombreCompleto: 'María Pérez',
      rol: 'usuario',
      activo: true,
    })
    expect(pagina.total).toBe(42)
    expect(pagina.pagina).toBe(2)
  })

  it('cambia el rol enviando el valor que espera el backend', async () => {
    const { repo, http } = crearRepo()

    await repo.cambiarRol('u1', 'personal_clena')

    expect(http.patch).toHaveBeenCalledWith('/users/u1/role', { role: 'personal_clena' })
  })

  it('ordena los roles del de mayor al de menor rango', async () => {
    const { repo } = crearRepo([
      { role: 'usuario', name: 'Usuario', rank: 10 },
      { role: 'administrador', name: 'Administrador', rank: 30 },
      { role: 'personal_clena', name: 'Personal', rank: 20 },
    ])

    const roles = await repo.listarRoles()

    expect(roles.map((r) => r.rol)).toEqual(['administrador', 'personal_clena', 'usuario'])
  })
})