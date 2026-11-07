/**
 * Hash de tokens de sesión (refresh tokens).
 *
 * No se usa bcrypt aquí: el refresh token es un valor de alta entropía, por lo
 * que SHA-256 es suficiente y permite comparaciones rápidas.
 */
export abstract class TokenHasher {
  abstract hash(token: string): string;
  abstract matches(token: string, tokenHash: string): boolean;
}

export const TOKEN_HASHER = Symbol('TOKEN_HASHER');
