import type { CategoriaGestion, DatosGuia, GuiaGestionResumen } from '../domain/entities'
import type { GestionRepository } from '../domain/gestion-repository'

const LIMITE_MAS_PEDIDA = 100

export function idCategoriaGestion(valor: string, categorias: CategoriaGestion[]): string {
  return categorias.find((c) => c.id === valor || c.slug === valor)?.id ?? valor
}

export function guiasMasPedidaAnterior(
  guias: GuiaGestionResumen[],
  categorias: CategoriaGestion[],
  datos: DatosGuia,
  idExcluido?: string,
): GuiaGestionResumen[] {
  const categoria = idCategoriaGestion(datos.categoriaId, categorias)

  return guias.filter(
    (guia) =>
      guia.esMasPedida &&
      guia.id !== idExcluido &&
      idCategoriaGestion(guia.categoriaId, categorias) === categoria,
  )
}

export async function quitarMasPedidaAnterior(
  repo: GestionRepository,
  datos: DatosGuia,
  idExcluido?: string,
): Promise<void> {
  const [pagina, categorias] = await Promise.all([
    repo.listarGuias(1, LIMITE_MAS_PEDIDA),
    repo.listarCategorias(),
  ])

  for (const guia of guiasMasPedidaAnterior(pagina.items, categorias, datos, idExcluido)) {
    await repo.quitarMasPedida(guia.id)
  }
}
