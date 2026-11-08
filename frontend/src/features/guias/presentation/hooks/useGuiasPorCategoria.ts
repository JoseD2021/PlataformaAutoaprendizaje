import { useQuery } from '@tanstack/react-query'
import { container } from '../../../../app/container'

export function useGuiasPorCategoria(categoriaId: string) {
  return useQuery({
    queryKey: ['guias', categoriaId],
    queryFn: () => container.listarGuiasPorCategoria.execute(categoriaId),
    enabled: Boolean(categoriaId),
  })
}