import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { container } from '../../../../app/container'
import { EVENTO_SESION_EXPIRADA } from '../../../../shared/http/client'
import { obtenerMensajeError } from '../../../../shared/http/obtener-mensaje-error'
import { obtenerTokens } from '../../../../shared/http/token-storage'
import type { Credenciales, DatosRegistro, Usuario } from '../../domain/entities'

interface AuthContextValor {
  usuario: Usuario | null
  cargando: boolean
  error: string | null
  iniciarSesion: (credenciales: Credenciales) => Promise<void>
  registrar: (datos: DatosRegistro) => Promise<void>
  cerrarSesion: () => Promise<void>
}

const AuthContext = createContext<AuthContextValor | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [cargando, setCargando] = useState(() => Boolean(obtenerTokens()))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!obtenerTokens()) return

    container.obtenerPerfil
      .execute()
      .then(setUsuario)
      .catch(() => setUsuario(null))
      .finally(() => setCargando(false))
  }, [])

  useEffect(() => {
    const manejarSesionExpirada = () => setUsuario(null)
    window.addEventListener(EVENTO_SESION_EXPIRADA, manejarSesionExpirada)
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, manejarSesionExpirada)
  }, [])

  async function iniciarSesion(credenciales: Credenciales) {
    setError(null)
    try {
      const sesion = await container.iniciarSesion.execute(credenciales)
      setUsuario(sesion.usuario)
    } catch (err) {
      setError(obtenerMensajeError(err))
      throw err
    }
  }

  async function registrar(datos: DatosRegistro) {
    setError(null)
    try {
      const sesion = await container.registrarUsuario.execute(datos)
      setUsuario(sesion.usuario)
    } catch (err) {
      setError(obtenerMensajeError(err))
      throw err
    }
  }

  async function cerrarSesion() {
    const tokens = obtenerTokens()
    if (tokens?.refreshToken) {
      await container.cerrarSesion.execute(tokens.refreshToken).catch(() => undefined)
    }
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, error, iniciarSesion, registrar, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValor {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return contexto
}
