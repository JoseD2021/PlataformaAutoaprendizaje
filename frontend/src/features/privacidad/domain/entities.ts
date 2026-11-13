export interface SeccionTerminosPrivacidad {
  titulo: string
  parrafos: string[]
}

export interface TerminosPrivacidad {
  version: string
  fechaVigencia: string
  titulo: string
  secciones: SeccionTerminosPrivacidad[]
}
