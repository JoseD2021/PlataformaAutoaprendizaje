import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { container } from '../../../../app/container'
import type { TerminosPrivacidad } from '../../domain/entities'

export function useTerminosPrivacidad() {
  return useQuery({
    queryKey: ['terminos-privacidad'],
    queryFn: () => container.obtenerTerminosPrivacidad.execute(),
    staleTime: 1000 * 60 * 60,
  })
}

export function useActualizarTerminosPrivacidad() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (datos: TerminosPrivacidad) => container.actualizarTerminosPrivacidad.execute(datos),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['terminos-privacidad'] }),
  })
}
