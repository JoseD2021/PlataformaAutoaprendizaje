import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageLayout } from '../../../../shared/components/PageLayout'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [enviando, setEnviando] = useState(false)
  const { iniciarSesion, error } = useAuth()
  const navigate = useNavigate()

  async function manejarEnvio(evento: FormEvent) {
    evento.preventDefault()
    setEnviando(true)
    try {
      await iniciarSesion({ email, password })
      navigate('/')
    } catch {
      setEnviando(false)
      return
    }
    setEnviando(false)
  }

  return (
    <PageLayout>
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
