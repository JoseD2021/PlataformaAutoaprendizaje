import { obtenerMensajeError } from '../../../shared/http/obtener-mensaje-error'
import { ErrorGestion } from '../domain/entities'

export function mensajeDeError(error: unknown): string {
  return error instanceof ErrorGestion ? error.message : obtenerMensajeError(error)
}
