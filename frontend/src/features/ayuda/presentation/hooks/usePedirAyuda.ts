import { useMutation } from '@tanstack/react-query'
import { container } from '../../../../app/container'
import type { NuevaSolicitudAyuda } from '../../domain/entities'

export function usePedirAyuda() {
  return useMutation({
    mutationFn: (solicitud: NuevaSolicitudAyuda) => container.pedirAyuda.execute(solicitud),
  })
}
