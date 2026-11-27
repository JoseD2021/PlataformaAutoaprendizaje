import { useRef, useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { PageLayout } from '../../../../shared/components/PageLayout'
import { NavegacionVolver } from '../../../../shared/components/NavegacionVolver'
import { obtenerMensajeError } from '../../../../shared/http/obtener-mensaje-error'
import { useAuth } from '../context/AuthContext'
import '../perfil.css'

export function PerfilPage() {
  const { usuario, cargando, cambiarNombre, cambiarContrasena, eliminarCuenta } = useAuth()

  const [contrasenaCambiada, setContrasenaCambiada] = useState(false)
  const [nombre, setNombre] = useState(usuario?.nombreCompleto ?? '')
  const [guardandoNombre, setGuardandoNombre] = useState(false)
  const [mensajeNombre, setMensajeNombre] = useState('')
  const [errorNombre, setErrorNombre] = useState('')

  const [contrasenaActual, setContrasenaActual] = useState('')
  const [contrasenaNueva, setContrasenaNueva] = useState('')
  const [repetirContrasena, setRepetirContrasena] = useState('')
  const [guardandoContrasena, setGuardandoContrasena] = useState(false)
  const [errorContrasena, setErrorContrasena] = useState('')

  const [eliminando, setEliminando] = useState(false)
  const [errorCuenta, setErrorCuenta] = useState('')
  const dialogoEliminarRef = useRef<HTMLDialogElement>(null)

  async function manejarContrasena(evento: FormEvent) {
    evento.preventDefault()
    setErrorContrasena('')
    if (contrasenaNueva !== repetirContrasena) {
      setErrorContrasena('Las contraseñas nuevas no coinciden.')
      return
    }
    setGuardandoContrasena(true)
    try {
      await cambiarContrasena(contrasenaActual, contrasenaNueva)
      setContrasenaCambiada(true)
    } catch (err) {
      setErrorContrasena(obtenerMensajeError(err))
    } finally {
      setGuardandoContrasena(false)
    }
  }

  function abrirConfirmacion() {
    setErrorCuenta('')
    dialogoEliminarRef.current?.showModal()
  }

  function cancelarEliminacion() {
    dialogoEliminarRef.current?.close()
  }

  async function confirmarEliminacion() {
    setErrorCuenta('')
    setEliminando(true)
    try {
      await eliminarCuenta()
      dialogoEliminarRef.current?.close()
    } catch (err) {
      setErrorCuenta(obtenerMensajeError(err))
    } finally {
      setEliminando(false)
    }
  }

  if (contrasenaCambiada) {
    return (
      <PageLayout>
        <div className="perfil-cabecera">
          <h1>Contraseña actualizada</h1>
          <p className="formulario-exito" role="status">
            Tu contraseña se cambió correctamente. Inicia sesión de nuevo para continuar.
          </p>
          <Link to="/login" className="btn btn--verde">Iniciar sesión</Link>
        </div>
      </PageLayout>
    )
  }

  if (cargando) {
    return <p role="status">Verificando tu sesión…</p>
  }

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  async function manejarNombre(evento: FormEvent) {
    evento.preventDefault()
    setMensajeNombre('')
    setErrorNombre('')
    setGuardandoNombre(true)
    try {
      await cambiarNombre(nombre)
      setMensajeNombre('Tu nombre se actualizó correctamente.')
    } catch (err) {
      setErrorNombre(obtenerMensajeError(err))
    } finally {
      setGuardandoNombre(false)
    }
  }

  return (
    <PageLayout>
      <NavegacionVolver />
      <div className="perfil-cabecera">
        <h1>Administrar perfil</h1>
        <p>Cambia tu nombre o tu contraseña cuando lo necesites.</p>
      </div>

      <section className="perfil-tarjeta" aria-labelledby="perfil-nombre-titulo">
        <div className="perfil-tarjeta__cabecera">
          <div>
            <h2 id="perfil-nombre-titulo">Tu nombre</h2>
            <p>Así aparecerás en la sala de internet.</p>
          </div>
        </div>
        <form className="formulario perfil-formulario" onSubmit={manejarNombre}>
          <div className="campo">
            <label htmlFor="perfil-nombre">Nombre completo</label>
            <input
              id="perfil-nombre"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              maxLength={120}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <small>Tu correo {usuario.email} no se puede cambiar aquí.</small>
          </div>
          {mensajeNombre && (
            <p className="formulario-exito" role="status">{mensajeNombre}</p>
          )}
          {errorNombre && (
            <p className="formulario-error" role="alert">{errorNombre}</p>
          )}
          <button type="submit" className="btn btn--verde" disabled={guardandoNombre}>
            {guardandoNombre ? 'Guardando…' : 'Guardar nombre'}
          </button>
        </form>
      </section>

      <section className="perfil-tarjeta" aria-labelledby="perfil-clave-titulo">
        <div className="perfil-tarjeta__cabecera">
          <div>
            <h2 id="perfil-clave-titulo">Tu contraseña</h2>
            <p>Usa al menos 8 caracteres, con mayúscula, minúscula y número.</p>
          </div>
        </div>
        <form className="formulario perfil-formulario" onSubmit={manejarContrasena}>
          <div className="campo">
            <label htmlFor="perfil-clave-actual">Contraseña actual</label>
            <input
              id="perfil-clave-actual"
              type="password"
              autoComplete="current-password"
              required
              value={contrasenaActual}
              onChange={(e) => setContrasenaActual(e.target.value)}
            />
          </div>
          <div className="campo">
            <label htmlFor="perfil-clave-nueva">Nueva contraseña</label>
            <input
              id="perfil-clave-nueva"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={72}
              value={contrasenaNueva}
              onChange={(e) => setContrasenaNueva(e.target.value)}
            />
            <small>Debe incluir una mayúscula, una minúscula y un número.</small>
          </div>
          <div className="campo">
            <label htmlFor="perfil-clave-repetir">Repite la nueva contraseña</label>
            <input
              id="perfil-clave-repetir"
              type="password"
              autoComplete="new-password"
              required
              value={repetirContrasena}
              onChange={(e) => setRepetirContrasena(e.target.value)}
            />
          </div>
          {errorContrasena && (
            <p className="formulario-error" role="alert">{errorContrasena}</p>
          )}
          <p className="perfil-aviso">
            Después de cambiar la contraseña tendrás que iniciar sesión de nuevo.
          </p>
          <button type="submit" className="btn btn--verde" disabled={guardandoContrasena}>
            {guardandoContrasena ? 'Cambiando…' : 'Cambiar contraseña'}
          </button>
        </form>
      </section>

      <section className="perfil-tarjeta perfil-tarjeta--peligro" aria-labelledby="perfil-cuenta-titulo">
        <div className="perfil-tarjeta__cabecera">
          <div>
            <h2 id="perfil-cuenta-titulo">Eliminar mi cuenta</h2>
            <p>Se borrarán tus datos y no podrás recuperarlos.</p>
          </div>
        </div>
        <div className="perfil-formulario">
          <button type="button" className="btn btn--peligro" onClick={abrirConfirmacion}>
            <Trash2 aria-hidden size={18} /> Eliminar mi cuenta
          </button>
        </div>
      </section>

      <dialog ref={dialogoEliminarRef} className="perfil-dialog" role="alertdialog" aria-labelledby="perfil-eliminar-titulo" aria-describedby="perfil-eliminar-descripcion">
        <h2 id="perfil-eliminar-titulo">¿Eliminar tu cuenta?</h2>
        <p id="perfil-eliminar-descripcion">
          Esta acción no se puede deshacer. Se eliminarán tu perfil, tus guías y tus favoritos.
        </p>
        {errorCuenta && (
          <p className="formulario-error" role="alert">{errorCuenta}</p>
        )}
        <div className="perfil-dialog__acciones">
          <button type="button" className="btn" onClick={cancelarEliminacion}>
            Cancelar
          </button>
          <button type="button" className="btn btn--peligro" onClick={confirmarEliminacion} disabled={eliminando}>
            {eliminando ? 'Eliminando…' : 'Sí, eliminar mi cuenta'}
          </button>
        </div>
      </dialog>
    </PageLayout>
  )
}
