import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageLayout } from '../../../../shared/components/PageLayout'
import { useAuth } from '../context/AuthContext'
import { NavegacionVolver } from '../../../../shared/components/NavegacionVolver'

export function RegistroPage() {
  const [nombreCompleto, setNombreCompleto] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [enviando, setEnviando] = useState(false)
  const { registrar, error } = useAuth()
  const navigate = useNavigate()

  async function manejarEnvio(evento: FormEvent) {
    evento.preventDefault()
    setEnviando(true)
    try {
      await registrar({ nombreCompleto, email, password })
      navigate('/')
    } catch {
      setEnviando(false)
      return
    }
    setEnviando(false)
  }

  return (
    <PageLayout>
      <NavegacionVolver />
      <h1>Crear una cuenta</h1>
      <form className="formulario" onSubmit={manejarEnvio}>
        <div className="campo">
          <label htmlFor="registro-nombre">Nombre completo</label>
          <input
            id="registro-nombre"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
          />
        </div>
        <div className="campo">
          <label htmlFor="registro-email">Correo electrónico</label>
          <input
            id="registro-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="campo">
          <label htmlFor="registro-password">Contraseña</label>
          <input
            id="registro-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <small>Debe incluir una mayúscula, una minúscula y un número.</small>
        </div>
        {error && (
          <p className="formulario-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn--verde" disabled={enviando}>
          {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>
      <p className="formulario-enlace">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
      </p>
    </PageLayout>
  )
}
