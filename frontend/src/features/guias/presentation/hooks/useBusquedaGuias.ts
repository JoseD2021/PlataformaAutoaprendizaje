import { useInfiniteQuery } from '@tanstack/react-query'
import { container } from '../../../../app/container'

export function useBusquedaGuias(consulta: string) {
  return useInfiniteQuery({
    queryKey: ['busqueda', consulta],
    queryFn: ({ pageParam }) => container.buscarGuias.execute(consulta, { pagina: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (ultimaPagina) =>
      ultimaPagina.pagina < ultimaPagina.totalPaginas ? ultimaPagina.pagina + 1 : undefined,
    enabled: consulta.trim().length >= 2,
  })
}
