import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { container } from '../../../../app/container'
import type { InformacionSala } from '../../domain/entities'

export function useInformacionSala() {
  return useQuery({
    queryKey: ['sala-informacion'],
    queryFn: () => container.obtenerInformacionSala.execute(),
  })
}

export function useActualizarInformacionSala() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (datos: InformacionSala) => container.actualizarInformacionSala.execute(datos),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sala-informacion'] }),
  })
}