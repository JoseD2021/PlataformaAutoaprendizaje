import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { PageLayout } from '../../../../shared/components/PageLayout'
import { NavegacionVolver } from '../../../../shared/components/NavegacionVolver'
import { RANGO_MINIMO_POR_PERMISO, tienePermiso } from '../../../../shared/permisos'
import { obtenerMensajeError } from '../../../../shared/http/obtener-mensaje-error'
import { useAuth } from '../../../auth/presentation/context/AuthContext'
import type { RolDetalle } from '../../domain/entities'
import { GRUPOS_PERMISOS, PERMISOS, type Permiso } from '../../domain/permisos'
import {
  useActualizarPermisosRol,
  useCrearRol,
  useEliminarRol,
  useRolesDetalle,
} from '../hooks/useRoles'
import '../../../admin/presentation/admin.css'
import '../roles.css'

const ROLES_RESERVADOS = ['administrador', 'usuario']

function alternar(lista: Permiso[], valor: Permiso): Permiso[] {
  return lista.includes(valor) ? lista.filter((permiso) => permiso !== valor) : [...lista, valor]
}

function ListaPermisos({
  prefijo,
  seleccionados,
  alCambiar,
  rango,
  permitidos,
  deshabilitado = false,
}: {
  prefijo: string
  seleccionados: Permiso[]
  alCambiar: (permiso: Permiso) => void
  rango: number
  permitidos: readonly Permiso[]
  deshabilitado?: boolean
}) {
  return (
    <div className="permisos-grupos">
      {GRUPOS_PERMISOS.map((grupo) => (
        <fieldset key={grupo} className="permisos-grupo" disabled={deshabilitado}>
          <legend>{grupo}</legend>
          <div className="permisos-lista">
            {PERMISOS.filter((permiso) => permiso.grupo === grupo).map((permiso) => {
              const id = `${prefijo}-${permiso.valor.replace(/:/g, '-')}`
              const requiereRango = RANGO_MINIMO_POR_PERMISO[permiso.valor]
              const noPorRango = rango < requiereRango
              const noPorActor = !permitidos.includes(permiso.valor)
              const motivo = noPorRango
                ? `Requiere un rango mínimo de ${requiereRango}.`
                : noPorActor
                  ? 'No tienes este permiso para otorgarlo.'
                  : undefined
              return (
                <label
                  className="permiso-opcion"
                  htmlFor={id}
                  key={permiso.valor}
                  title={motivo}
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={seleccionados.includes(permiso.valor)}
                    disabled={noPorRango || noPorActor}
                    onChange={() => alCambiar(permiso.valor)}
                  />
                  <span>{permiso.etiqueta}</span>
                </label>
              )
            })}
          </div>
        </fieldset>
      ))}
    </div>
  )
}

export function RolesPage() {
  const { usuario, cargando } = useAuth()
  const roles = useRolesDetalle()
  const crearRol = useCrearRol()
  const actualizarPermisos = useActualizarPermisosRol()
  const eliminarRol = useEliminarRol()

  const [slug, setSlug] = useState('')
  const [nombre, setNombre] = useState('')
  const [rango, setRango] = useState('10')
  const [permisosNuevos, setPermisosNuevos] = useState<Permiso[]>([])
  const [avisoCrear, setAvisoCrear] = useState('')
  const [errorCrear, setErrorCrear] = useState('')

  // Solo guardamos aquí los cambios del usuario; el valor inicial viene del servidor.
  const [cambios, setCambios] = useState<Record<string, Permiso[]>>({})
  const [avisoPermisos, setAvisoPermisos] = useState('')
  const [errorPermisos, setErrorPermisos] = useState('')
  const [editando, setEditando] = useState('')
  const [avisoEliminar, setAvisoEliminar] = useState('')
  const [errorEliminar, setErrorEliminar] = useState('')
  const [borrando, setBorrando] = useState('')

  if (cargando) return null
  if (!usuario || !tienePermiso(usuario, 'roles:read')) return <Navigate to="/" replace />

  const rangoActor = usuario.rango ?? 30
  const rangoMaximo = Math.max(1, rangoActor - 1)
  const permitidos = PERMISOS.filter((permiso) => tienePermiso(usuario, permiso.valor)).map(
    (permiso) => permiso.valor,
  )
  const puedeCrear = tienePermiso(usuario, 'roles:create')
  const puedeActualizar = tienePermiso(usuario, 'roles:update-permissions')
  const puedeBorrar = tienePermiso(usuario, 'roles:delete')

  async function crear(evento: FormEvent) {
    evento.preventDefault()
    setAvisoCrear('')
    setErrorCrear('')
    try {
      const creado = await crearRol.mutateAsync({
        rol: slug.trim().toLowerCase(),
        nombre: nombre.trim(),
        rango: Number(rango),
        permisos: permisosNuevos,
      })
      setAvisoCrear(`Rol «${creado.nombre}» creado correctamente.`)
      setSlug('')
      setNombre('')
      setRango('10')
      setPermisosNuevos([])
    } catch (err) {
      setErrorCrear(obtenerMensajeError(err))
    }
  }

  async function guardarPermisos(rol: RolDetalle) {
    setAvisoPermisos('')
    setErrorPermisos('')
    setEditando(rol.rol)
    try {
      await actualizarPermisos.mutateAsync({
        rol: rol.rol,
        permisos: cambios[rol.rol] ?? rol.permisos,
      })
      setCambios((actual) => {
        const { [rol.rol]: _guardado, ...restantes } = actual
        return restantes
      })
      setAvisoPermisos(`Permisos de «${rol.nombre}» actualizados.`)
    } catch (err) {
      setErrorPermisos(obtenerMensajeError(err))
    } finally {
      setEditando('')
    }
  }

  async function borrar(rol: RolDetalle) {
    if (!window.confirm(`¿Eliminar el rol «${rol.nombre}»? Esta acción no se puede deshacer.`)) return
    setAvisoEliminar('')
    setErrorEliminar('')
    setBorrando(rol.rol)
    try {
      await eliminarRol.mutateAsync(rol.rol)
      setAvisoEliminar(`Rol «${rol.nombre}» eliminado correctamente.`)
    } catch (err) {
      setErrorEliminar(obtenerMensajeError(err))
    } finally {
      setBorrando('')
    }
  }

  return (
    <PageLayout>
      <div className="admin">
        <NavegacionVolver conAtras={false} conAccionesAdmin />
        <h1>Roles y permisos</h1>
        <p>Crea roles nuevos y elige qué puede hacer cada uno. Los cambios se aplican al guardar.</p>
        <p className="admin-nota">
          Cada permiso tiene un rango mínimo y solo puedes otorgar los que tú posees.
        </p>

        {puedeCrear && (
          <section className="roles-seccion" aria-labelledby="roles-crear-titulo">
            <h2 id="roles-crear-titulo">Crear un rol nuevo</h2>
            <form className="roles-formulario" onSubmit={crear}>
              <div className="roles-fila">
                <div className="campo">
                  <label htmlFor="rol-slug">Identificador</label>
                  <input
                    id="rol-slug"
                    type="text"
                    required
                    pattern="[a-z][a-z0-9_-]{0,31}"
                    title="Solo letras minúsculas, números, guiones y guiones bajos. Máximo 32 caracteres."
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                  <small>Ejemplo: colaborador. No se puede cambiar después.</small>
                </div>
                <div className="campo">
                  <label htmlFor="rol-nombre">Nombre visible</label>
                  <input
                    id="rol-nombre"
                    type="text"
                    required
                    minLength={2}
                    maxLength={80}
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                  <small>Así verás el rol en la lista de usuarios.</small>
                </div>
                <div className="campo">
                  <label htmlFor="rol-rango">Rango</label>
                  <input
                    id="rol-rango"
                    type="number"
                    required
                    min={1}
                    max={rangoMaximo}
                    value={rango}
                    onChange={(e) => setRango(e.target.value)}
                  />
                  <small>Debe ser menor que tu rango ({rangoActor}).</small>
                </div>
              </div>
              <fieldset className="permisos-grupo">
                <legend>Permisos del nuevo rol</legend>
                <ListaPermisos
                  prefijo="crear"
                  seleccionados={permisosNuevos}
                  rango={Number(rango) || 1}
                  permitidos={permitidos}
                  alCambiar={(permiso) => setPermisosNuevos((actuales) => alternar(actuales, permiso))}
                />
              </fieldset>
              {avisoCrear && <p className="admin-aviso" role="status">{avisoCrear}</p>}
              {errorCrear && <p className="admin-mensaje" role="alert">{errorCrear}</p>}
              <button type="submit" className="btn btn--verde btn-sm" disabled={crearRol.isPending}>
                {crearRol.isPending ? 'Creando…' : 'Crear rol'}
              </button>
            </form>
          </section>
        )}

        <section className="roles-seccion" aria-labelledby="roles-actuales-titulo">
          <h2 id="roles-actuales-titulo">Permisos de los roles existentes</h2>
          <p>Abre un rol para revisar, cambiar sus permisos o eliminarlo.</p>
          {avisoPermisos && <p className="admin-aviso" role="status">{avisoPermisos}</p>}
          {errorPermisos && <p className="admin-mensaje" role="alert">{errorPermisos}</p>}
          {avisoEliminar && <p className="admin-aviso" role="status">{avisoEliminar}</p>}
          {errorEliminar && <p className="admin-mensaje" role="alert">{errorEliminar}</p>}
          {roles.isLoading && <p role="status">Cargando roles…</p>}
          {roles.isError && (
            <p className="admin-mensaje" role="alert">No se pudo cargar la lista de roles.</p>
          )}
          {roles.data?.map((rol) => {
            const seleccionados = cambios[rol.rol] ?? rol.permisos
            const editable = rol.rango < rangoActor && puedeActualizar
            const borrable =
              rol.rango < rangoActor && puedeBorrar && !ROLES_RESERVADOS.includes(rol.rol)
            return (
              <details className="rol-detalle" key={rol.rol}>
                <summary>
                  <strong>{rol.nombre}</strong>
                  <span className="admin-chip">{rol.rol} · rango {rol.rango}</span>
                  <span className="admin-chip">{seleccionados.length} permisos</span>
                </summary>
                <div className="rol-detalle__contenido">
                  {!editable && (
                    <p className="admin-nota">
                      Este rol tiene tu misma jerarquía o una superior, o no tienes permiso para cambiarlo.
                    </p>
                  )}
                  <ListaPermisos
                    prefijo={`rol-${rol.rol}`}
                    seleccionados={seleccionados}
                    rango={rol.rango}
                    permitidos={permitidos}
                    deshabilitado={!editable}
                    alCambiar={(permiso) =>
                      setCambios((actual) => ({
                        ...actual,
                        [rol.rol]: alternar(seleccionados, permiso),
                      }))
                    }
                  />
                  <div className="rol-detalle__acciones">
                    <button
                      type="button"
                      className="btn btn--verde btn-sm"
                      disabled={!editable || editando === rol.rol}
                      onClick={() => guardarPermisos(rol)}
                    >
                      {editando === rol.rol ? 'Guardando…' : 'Guardar permisos'}
                    </button>
                    <button
                      type="button"
                      className="btn btn--peligro btn-sm"
                      aria-label={`Eliminar rol ${rol.nombre}`}
                      disabled={!borrable || borrando === rol.rol}
                      onClick={() => borrar(rol)}
                    >
                      <Trash2 aria-hidden size={16} />
                      {borrando === rol.rol ? 'Eliminando…' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              </details>
            )
          })}
        </section>
      </div>
    </PageLayout>
  )
}
