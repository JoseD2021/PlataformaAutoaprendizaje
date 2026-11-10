import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { container } from '../../../../app/container'
import type { Favorito } from '../../domain/entities'

export function useFavoritos(usuarioId: string | undefined) {
  const queryClient = useQueryClient()
  const queryKey = ['favoritos', usuarioId]
  const refrescar = () => queryClient.invalidateQueries({ queryKey })

  const lista = useQuery({
    queryKey,
    queryFn: () => container.listarFavoritos.execute(usuarioId ?? ''),
    enabled: Boolean(usuarioId),
  })

  const agregar = useMutation({
    mutationFn: (f: Favorito) => container.agregarFavorito.execute(usuarioId ?? '', f),
    onSuccess: refrescar,
  })

  const quitar = useMutation({
    mutationFn: (guiaId: string) => container.quitarFavorito.execute(usuarioId ?? '', guiaId),
    onSuccess: refrescar,
  })

  return { favoritos: lista.data ?? [], cargando: lista.isLoading, agregar, quitar }
}