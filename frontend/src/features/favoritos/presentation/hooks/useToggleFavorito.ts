import { useMutation, useQueryClient } from '@tanstack/react-query'
import { container } from '../../../../app/container'
import { FAVORITOS_QUERY_KEY } from './useFavoritos'

export function useToggleFavorito() {
  const queryClient = useQueryClient()
  const invalidar = () => queryClient.invalidateQueries({ queryKey: FAVORITOS_QUERY_KEY })

  const agregar = useMutation({
    mutationFn: (guiaId: string) => container.agregarFavorito.execute(guiaId),
    onSuccess: invalidar,
  })

  const quitar = useMutation({
    mutationFn: (guiaId: string) => container.quitarFavorito.execute(guiaId),
    onSuccess: invalidar,
  })

  return { agregar, quitar }
}
