import { useQuery } from '@tanstack/react-query'
import { container } from '../../../../app/container'

export function useCategorias() {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: () => container.listarCategorias.execute(),
  })
}