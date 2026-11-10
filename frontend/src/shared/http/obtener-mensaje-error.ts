import axios from 'axios'

const MENSAJE_POR_DEFECTO = 'Ocurrió un error. Intenta de nuevo o pide ayuda a un monitor.'

export function obtenerMensajeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const mensaje = (error.response?.data as { error?: { message?: string } } | undefined)?.error
      ?.message
    if (mensaje) return mensaje
  }
  return MENSAJE_POR_DEFECTO
}
