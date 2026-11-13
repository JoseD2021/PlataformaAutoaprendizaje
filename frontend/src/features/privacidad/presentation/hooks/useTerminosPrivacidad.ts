import { useQuery } from '@tanstack/react-query'
import { container } from '../../../../app/container'

export function useTerminosPrivacidad() {
  return useQuery({
    queryKey: ['terminos-privacidad'],
    queryFn: () => container.obtenerTerminosPrivacidad.execute(),
    staleTime: 1000 * 60 * 60,
  })
}
