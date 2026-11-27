import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { container } from '../../../../app/container'

export const AYUDAS_PENDIENTES_QUERY_KEY = ['ayudas-pendientes']
const INTERVALO_CONSULTA_MS = 10_000

/** Consulta cada 10 segundos las solicitudes pendientes (solo para el personal). */
export function useAyudasPendientes(habilitado: boolean) {
  return useQuery({
    queryKey: AYUDAS_PENDIENTES_QUERY_KEY,
    queryFn: () => container.listarAyudasPendientes.execute(),
    enabled: habilitado,
    refetchInterval: INTERVALO_CONSULTA_MS,
  })
}

export function useMarcarAyudaAtendida() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => container.marcarAyudaAtendida.execute(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: AYUDAS_PENDIENTES_QUERY_KEY }),
  })
}
