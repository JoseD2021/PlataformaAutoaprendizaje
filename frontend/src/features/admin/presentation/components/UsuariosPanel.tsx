import { useState } from 'react'
import { ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { obtenerMensajeError } from '../../../../shared/http/obtener-mensaje-error'
import type { Rol } from '../../../auth/domain/entities'
import { useAuth } from '../../../auth/presentation/context/AuthContext'
import type { RolInfo, UsuarioAdmin } from '../../domain/entities'
import { USUARIOS_POR_PAGINA, useCambiarRol, useRoles, useUsuarios } from '../hooks/useAdmin'

// Se usan si GET /roles falla, para no dejar el panel inutilizable.
const ROLES_RESPALDO: RolInfo[] = [
  { rol: 'administrador', nombre: 'Administrador', rango: 30 },
  { rol: 'personal_clena', nombre: 'Personal de la sala', rango: 20 },
  { rol: 'usuario', nombre: 'Usuario', rango: 10 },
]

interface FilaProps {
  usuario: UsuarioAdmin
  roles: RolInfo[]
  esYo: boolean
  guardando: boolean
  onGuardar: (usuario: UsuarioAdmin, rol: Rol) => void
}

function FilaUsuario({ usuario, roles, esYo, guardando, onGuardar }: FilaProps) {
  const [rolElegido, setRolElegido] = useState<Rol>(usuario.rol)
  const hayCambio = rolElegido !== usuario.rol
  const idSelect = `rol-${usuario.id}`

  return (
    <tr>
      <td>
        <strong>{usuario.nombreCompleto}</strong>
        {esYo && <span className="chip chip--contorno admin-chip">Tú</span>}
        {!usuario.activo && <span className="chip chip--rojo admin-chip">Inactivo</span>}
      </td>
      <td>{usuario.email}</td>
      <td>
        <label htmlFor={idSelect} className="admin-solo-lectores">
          Rol de {usuario.nombreCompleto}
        </label>
        <select
          id={idSelect}
          value={rolElegido}
          disabled={esYo || guardando}
          onChange={(e) => setRolElegido(e.target.value as Rol)}
        >
          {roles.map((r) => (
            <option key={r.rol} value={r.rol}>{r.nombre}</option>
          ))}
        </select>
        {esYo && <small className="admin-nota">No puedes cambiar tu propio rol.</small>}
      </td>
      <td>
        <button
          type="button"
          className="btn btn--verde btn-sm"
          disabled={!hayCambio || esYo || guardando}
          onClick={() => onGuardar(usuario, rolElegido)}
        >
          <Save aria-hidden size={16} /> Guardar rol
        </button>
      </td>
    </tr>
  )
}

export function UsuariosPanel() {
  const { usuario: yo } = useAuth()
  const [pagina, setPagina] = useState(1)
  const [aviso, setAviso] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const usuarios = useUsuarios(pagina)
  const roles = useRoles()
  const cambiarRol = useCambiarRol()

  const opciones = roles.data ?? ROLES_RESPALDO

  async function guardar(usuario: UsuarioAdmin, rol: Rol) {
    setAviso(null)
    setError(null)
    try {
      await cambiarRol.mutateAsync({ id: usuario.id, rol })
      const nombreRol = opciones.find((r) => r.rol === rol)?.nombre ?? rol
      setAviso(`El rol de ${usuario.nombreCompleto} ahora es «${nombreRol}».`)
    } catch (e) {
      setError(obtenerMensajeError(e))
    }
  }

  if (usuarios.isLoading) return <p role="status">Cargando usuarios…</p>
  if (usuarios.isError || !usuarios.data) {
    return <p role="alert" className="admin-mensaje">No se pudo cargar la lista de usuarios.</p>
  }

  const { items, total } = usuarios.data
  const totalPaginas = Math.max(1, Math.ceil(total / USUARIOS_POR_PAGINA))

  return (
    <section aria-label="Usuarios y roles">
      {aviso && <p role="status" className="admin-aviso">{aviso}</p>}
      {error && <p role="alert" className="admin-mensaje">{error}</p>}

      {items.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <div className="admin-tabla-marco">
          <table className="admin-tabla">
            <caption className="admin-solo-lectores">Usuarios registrados y su rol</caption>
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Correo</th>
                <th scope="col">Rol</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <FilaUsuario
                  key={`${u.id}-${u.rol}`}
                  usuario={u}
                  roles={opciones}
                  esYo={u.id === yo?.id}
                  guardando={cambiarRol.isPending}
                  onGuardar={guardar}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <nav aria-label="Paginación de usuarios" className="admin-paginacion">
        <button
          type="button"
          className="btn btn--claro btn-sm"
          onClick={() => setPagina((p) => p - 1)}
          disabled={pagina <= 1}
        >
          <ChevronLeft aria-hidden size={16} /> Anterior
        </button>
        <span>Página {pagina} de {totalPaginas} · {total} usuarios</span>
        <button
          type="button"
          className="btn btn--claro btn-sm"
          onClick={() => setPagina((p) => p + 1)}
          disabled={pagina >= totalPaginas}
        >
          Siguiente <ChevronRight aria-hidden size={16} />
        </button>
      </nav>
    </section>
  )
}