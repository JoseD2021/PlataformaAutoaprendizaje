/**
 * Error de la capa de aplicación.
 *
 * A diferencia del dominio, este error sí conoce el status HTTP que debe
 * devolver la API y es traducido por el filtro global de excepciones.
 */
export class ApplicationError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly statusCode: number,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = new.target.name;
  }
}
