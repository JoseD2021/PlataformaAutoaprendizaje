import { describe, expect, it, vi } from 'vitest'
import type { AxiosInstance } from 'axios'
import { RolesHttpRepository } from './roles-http-repository'

function crearRepo(data: unknown = undefined) {
  const http = {
    get: vi.fn().mockResolvedValue({ data }),
    post: vi.fn().mockResolvedValue({ data }),
    patch: vi.fn().mockResolvedValue({ data }),
    delete: vi.fn().mockResolvedValue({ data }),
  }
  return { http, repo: new RolesHttpRepository(http as unknown as AxiosInstance) }
}

const ROL_ADMIN = { role: 'administrador', name: 'Administrador', rank: 30, permissions: ['users:read'] }

describe('RolesHttpRepository', () => {
  it('lista los roles con sus permisos, de mayor a menor rango', async () => {
    const { repo } = crearRepo([
      { role: 'usuario', name: 'Usuario', rank: 10, permissions: ['favorites:manage'] },
      ROL_ADMIN,
    ])

    const roles = await repo.listar()

    expect(roles).toEqual([
      { rol: 'administrador', nombre: 'Administrador', rango: 30, permisos: ['users:read'] },
      { rol: 'usuario', nombre: 'Usuario', rango: 10, permisos: ['favorites:manage'] },
    ])
  })

  it('crea un rol con el cuerpo que espera el backend', async () => {
    const { repo, http } = crearRepo(ROL_ADMIN)

    const resultado = await repo.crear({
      rol: 'colaborador',
      nombre: 'Colaborador',
      rango: 15,
      permisos: ['users:read'],
    })

    expect(http.post).toHaveBeenCalledWith('/roles', {
      role: 'colaborador',
      name: 'Colaborador',
      rank: 15,
      permissions: ['users:read'],
    })
    expect(resultado.rol).toBe('administrador')
  })

  it('actualiza los permisos con PATCH /roles/:role/permissions', async () => {
    const { repo, http } = crearRepo(ROL_ADMIN)

    await repo.actualizarPermisos('personal clena', ['guides:manage'])

    expect(http.patch).toHaveBeenCalledWith('/roles/personal%20clena/permissions', {
      permissions: ['guides:manage'],
    })
  })

  it('elimina un rol con DELETE /roles/:role', async () => {
    const { repo, http } = crearRepo()

    await repo.eliminar('personal clena')

    expect(http.delete).toHaveBeenCalledWith('/roles/personal%20clena')
  })
})
