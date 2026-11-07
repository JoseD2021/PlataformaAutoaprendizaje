export type DomainErrorKind = 'validation' | 'forbidden' | 'conflict';

/**
 * Error base de la capa de dominio.
 *
 * No conoce HTTP: solo expresa una regla de negocio incumplida y una
 * clasificación que la capa de presentación traduce a un status code.
 */
export class DomainError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly kind: DomainErrorKind = 'validation',
  ) {
    super(message);
    this.name = new.target.name;
  }
}
