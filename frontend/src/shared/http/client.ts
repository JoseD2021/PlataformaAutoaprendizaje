import axios from 'axios'
import { guardarTokens, limpiarTokens, obtenerTokens } from './token-storage'

export const EVENTO_SESION_EXPIRADA = 'auth:sesion-expirada'

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
})

const RUTAS_SIN_REINTENTO = ['/auth/login', '/auth/register', '/auth/refresh']

httpClient.interceptors.request.use((config) => {
  const tokens = obtenerTokens()
  if (tokens?.accessToken) {
    config.headers.set('Authorization', `Bearer ${tokens.accessToken}`)
  }
  return config
})

let refrescando: Promise<string> | null = null

async function refrescarAccessToken(refreshToken: string): Promise<string> {
  const { data } = await axios.post<{ tokens: { accessToken: string; refreshToken: string } }>(
    `${httpClient.defaults.baseURL}/auth/refresh`,
    { refreshToken },
  )

  guardarTokens({ accessToken: data.tokens.accessToken, refreshToken: data.tokens.refreshToken })
  return data.tokens.accessToken
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config
    const esRutaSinReintento = RUTAS_SIN_REINTENTO.some((ruta) => config?.url?.includes(ruta))

    if (error.response?.status !== 401 || esRutaSinReintento || !config || config.yaReintentado) {
      throw error
    }

    const tokens = obtenerTokens()
    if (!tokens?.refreshToken) {
      limpiarTokens()
      window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA))
      throw error
    }

    try {
      refrescando ??= refrescarAccessToken(tokens.refreshToken)
      const nuevoAccessToken = await refrescando
      refrescando = null

      config.yaReintentado = true
      config.headers.set('Authorization', `Bearer ${nuevoAccessToken}`)
      return httpClient.request(config)
    } catch (errorDeRefresh) {
      refrescando = null
      limpiarTokens()
      window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA))
      throw errorDeRefresh
    }
  },
)
