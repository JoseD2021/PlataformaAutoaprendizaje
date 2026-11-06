import { useQuery } from '@tanstack/react-query'
import { container } from '../../../../app/container'

export function useGuiasPorCategoria(id: string) {
  return useQuery({
    queryKey: ['guias', id],
    queryFn: () => container.listarGuiasPorCategoria.execute(id),
  })
}