import type { GuiasRepository, PaginaBusquedaGuias } from '../domain/guias-repository'

const MIN_CARACTERES = 2
const MAX_CARACTERES = 100
const LIMITE_MAXIMO = 50 // el backend rechaza límites mayores

export interface BuscarGuiasOpciones {
  pagina?: number
  limite?: number
}

export class BuscarGuias {
  private readonly repo: GuiasRepository

  constructor(repo: GuiasRepository) {
    this.repo = repo
  }

  async execute(consulta: string, opciones: BuscarGuiasOpciones = {}): Promise<PaginaBusquedaGuias> {
    const texto = consulta.trim()
    const pagina = Math.max(1, opciones.pagina ?? 1)
    const limite = Math.min(LIMITE_MAXIMO, Math.max(1, opciones.limite ?? 10))

    // El backend rechaza consultas demasiado cortas o largas: respondemos
    // con una página vacía en lugar de hacer una llamada que fallará.
    if (texto.length < MIN_CARACTERES || texto.length > MAX_CARACTERES) {
      return { items: [], total: 0, pagina, totalPaginas: 0 }
    }

    return this.repo.buscarGuias(texto, pagina, limite)
  }
}
