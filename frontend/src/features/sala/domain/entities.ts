export interface HorarioDia {
  dias: string   // "Lunes a viernes"
  horas: string  // "8:00 a.m. a 5:00 p.m."
}

export interface InformacionSala {
  horarios: HorarioDia[]
  normas: string[]
}