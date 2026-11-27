import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { PageLayout } from '../../../../shared/components/PageLayout'
import { NavegacionVolver } from '../../../../shared/components/NavegacionVolver'
import { PERMISOS_GESTION, tieneAlgunPermiso, tienePermiso } from '../../../../shared/permisos'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [enviando, setEnviando] = useState(false)
  const { usuario, iniciarSesion, error } = useAuth()

  async function manejarEnvio(evento: FormEvent) {
    evento.preventDefault()
    setEnviando(true)
    try {
      await iniciarSesion({ email, password })
    } catch {
      // el mensaje de error lo expone el contexto
    } finally {
      setEnviando(false)
    }
  }

  if (usuario) {
    const destino = tienePermiso(usuario, 'users:read')
      ? '/admin'
      : tieneAlgunPermiso(usuario, PERMISOS_GESTION)
        ? '/gestion'
        : '/'
    return <Navigate to={destino} replace />
  }

  return (
    <PageLayout>
      <NavegacionVolver />
      <h1>Iniciar sesión</h1>
      <form className="formulario" onSubmit={manejarEnvio}>
        <div className="campo">
          <label htmlFor="login-email">Correo electrónico</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="campo">
          <label htmlFor="login-password">Contraseña</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <p className="formulario-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn--verde" disabled={enviando}>
          {enviando ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
      <p className="formulario-enlace">
        ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
      </p>
    </PageLayout>
  )
}
