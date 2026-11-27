import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { container } from '../../../../app/container'
import { EVENTO_SESION_EXPIRADA } from '../../../../shared/http/client'
import { obtenerMensajeError } from '../../../../shared/http/obtener-mensaje-error'
import { limpiarTokens, obtenerTokens } from '../../../../shared/http/token-storage'
import type { Credenciales, DatosRegistro, Usuario } from '../../domain/entities'

interface AuthContextValor {
  usuario: Usuario | null
  cargando: boolean
  error: string | null
  iniciarSesion: (credenciales: Credenciales) => Promise<Usuario>
  registrar: (datos: DatosRegistro) => Promise<void>
  cerrarSesion: () => Promise<void>
  aceptarTerminosPrivacidad: (version: string) => Promise<void>
  cambiarNombre: (nombreCompleto: string) => Promise<void>
  cambiarContrasena: (contrasenaActual: string, contrasenaNueva: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValor | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [cargando, setCargando] = useState(() => Boolean(obtenerTokens()))
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!obtenerTokens()) return

    container.obtenerPerfil
      .execute()
      .then(setUsuario)
      .catch(() => setUsuario(null))
      .finally(() => setCargando(false))
  }, [])

  useEffect(() => {
    const manejarSesionExpirada = () => {
      setUsuario(null)
      queryClient.clear()
    }
    window.addEventListener(EVENTO_SESION_EXPIRADA, manejarSesionExpirada)
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, manejarSesionExpirada)
  }, [queryClient])

  async function iniciarSesion(credenciales: Credenciales): Promise<Usuario> {
    setError(null)
    try {
      const sesion = await container.iniciarSesion.execute(credenciales)
      setUsuario(sesion.usuario)
      return sesion.usuario
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
    queryClient.clear()
  }

  async function aceptarTerminosPrivacidad(version: string) {
    setError(null)
    try {
      const actualizado = await container.aceptarTerminosPrivacidad.execute(version)
      setUsuario(actualizado)
    } catch (err) {
      setError(obtenerMensajeError(err))
      throw err
    }
  }

  async function cambiarNombre(nombreCompleto: string) {
    await container.cambiarNombre.execute(nombreCompleto)
    const nombreNormalizado = nombreCompleto.trim()
    setUsuario((actual) => (actual ? { ...actual, nombreCompleto: nombreNormalizado } : actual))
  }

  async function cambiarContrasena(contrasenaActual: string, contrasenaNueva: string) {
    await container.cambiarContrasena.execute(contrasenaActual, contrasenaNueva)
    limpiarTokens()
    setUsuario(null)
    queryClient.clear()
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargando,
        error,
        iniciarSesion,
        registrar,
        cerrarSesion,
        aceptarTerminosPrivacidad,
        cambiarNombre,
        cambiarContrasena,
      }}
    >
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
