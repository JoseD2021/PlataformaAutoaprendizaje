export function rutaDeBusqueda(consulta: string): string {
  return `/buscar?q=${encodeURIComponent(consulta.trim())}`
}
