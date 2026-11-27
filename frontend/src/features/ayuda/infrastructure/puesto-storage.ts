const CLAVE = 'clena:puesto'

/** Número de computador recordado en este navegador (cada PC de la sala tiene el suyo). */
export function obtenerPuestoGuardado(): string {
  try {
    return localStorage.getItem(CLAVE) ?? ''
  } catch {
    return ''
  }
}

export function guardarPuesto(puesto: number | undefined) {
  try {
    if (puesto === undefined) localStorage.removeItem(CLAVE)
    else localStorage.setItem(CLAVE, String(puesto))
  } catch {
    // Sin almacenamiento disponible: el puesto simplemente no se recuerda.
  }
}
