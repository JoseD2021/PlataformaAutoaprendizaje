import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { container } from '../../../../app/container'
import type { Rol } from '../../../auth/domain/entities'

export const USUARIOS_POR_PAGINA = 20

export function useUsuarios(pagina: number) {
  return useQuery({
    queryKey: ['admin', 'usuarios', pagina],
    queryFn: () => container.listarUsuarios.execute(pagina, USUARIOS_POR_PAGINA),
    placeholderData: keepPreviousData,
  })
}

export function useRoles() {
  return useQuery({
    queryKey: ['admin', 'roles'],
    queryFn: () => container.listarRoles.execute(),
  })
}

export function useCambiarRol() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, rol }: { id: string; rol: Rol }) => container.cambiarRolUsuario.execute(id, rol),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'usuarios'] }),
  })
}