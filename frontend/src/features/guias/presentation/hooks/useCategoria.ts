import { useQuery } from '@tanstack/react-query'
import { container } from '../../../../app/container'

export function useCategoria(id: string) {
  return useQuery({
    queryKey: ['categoria', id],
    queryFn: () => container.obtenerCategoria.execute(id),
  })
}