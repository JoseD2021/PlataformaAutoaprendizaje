import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { PageLayout } from '../../../../shared/components/PageLayout'
import { NavegacionVolver } from '../../../../shared/components/NavegacionVolver'
import { obtenerMensajeError } from '../../../../shared/http/obtener-mensaje-error'
import { useAuth } from '../context/AuthContext'
import '../perfil.css'

export function PerfilPage() {
  const { usuario, cargando, cambiarNombre, cambiarContrasena } = useAuth()

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
    </PageLayout>
  )
}
