/** Dónde se quedó la persona; lo llena sola la pantalla de la guía. */
export interface ContextoAyuda {
  guiaId: string
  guiaTitulo: string
  paso?: number
}

export interface NuevaSolicitudAyuda {
  puesto?: number
  guiaId?: string
  paso?: number
}

export interface SolicitudAyuda {
  id: string
  puesto: number | null
  guiaId: string | null
  guiaTitulo: string | null
  paso: number | null
  /** Nombre de quien pidió ayuda si tenía sesión iniciada. */
  solicitante: string | null
  creadaEn: string
}
