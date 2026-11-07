import { useQuery } from '@tanstack/react-query'
import { container } from '../../../../app/container'

export function useGuia(id: string) {
  return useQuery({
    queryKey: ['guia', id],
    queryFn: () => container.obtenerGuia.execute(id),
  })
}
