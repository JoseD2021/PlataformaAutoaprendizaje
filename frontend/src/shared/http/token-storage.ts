const CLAVE = 'clena.auth.tokens'

export interface TokensAlmacenados {
  accessToken: string
  refreshToken: string
}

export function obtenerTokens(): TokensAlmacenados | null {
  const crudo = localStorage.getItem(CLAVE)
  if (!crudo) return null

  try {
    return JSON.parse(crudo) as TokensAlmacenados
  } catch {
    return null
  }
}

export function guardarTokens(tokens: TokensAlmacenados): void {
  localStorage.setItem(CLAVE, JSON.stringify(tokens))
}

export function limpiarTokens(): void {
  localStorage.removeItem(CLAVE)
}
