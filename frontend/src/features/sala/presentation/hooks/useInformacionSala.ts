import { useQuery } from '@tanstack/react-query'
import { container } from '../../../../app/container'

export function useInformacionSala() {
  return useQuery({
    queryKey: ['sala-informacion'],
    queryFn: () => container.obtenerInformacionSala.execute(),
  })
}