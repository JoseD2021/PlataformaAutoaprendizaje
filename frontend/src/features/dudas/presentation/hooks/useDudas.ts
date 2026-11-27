import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { container } from '../../../../app/container'
import type { NuevaDuda } from '../../domain/entities'

export const DUDAS_QUERY_KEY = ['dudas']
export const CATEGORIAS_DUDAS_QUERY_KEY = ['categorias-dudas']

export function useDudas(habilitado = true) {
  return useQuery({
    queryKey: DUDAS_QUERY_KEY,
    queryFn: () => container.listarDudas.execute(),
    enabled: habilitado,
  })
}

export function useCategoriasDudas(habilitado = true) {
  return useQuery({
    queryKey: CATEGORIAS_DUDAS_QUERY_KEY,
    queryFn: () => container.listarCategoriasDudas.execute(),
    enabled: habilitado,
  })
}

export function useAnotarDuda() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (nueva: NuevaDuda) => container.anotarDuda.execute(nueva),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DUDAS_QUERY_KEY }),
  })
}

export function useEliminarDuda() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => container.eliminarDuda.execute(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DUDAS_QUERY_KEY }),
  })
}
