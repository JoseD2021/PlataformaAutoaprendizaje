import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { container } from '../../../../app/container'
import type { DatosNuevoRol } from '../../domain/entities'
import type { Permiso } from '../../domain/permisos'

const CLAVE_ROLES = ['roles', 'detalle']

export function useRolesDetalle() {
  return useQuery({
    queryKey: CLAVE_ROLES,
    queryFn: () => container.listarRolesDetalle.execute(),
  })
}

export function useCrearRol() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (datos: DatosNuevoRol) => container.crearRol.execute(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLAVE_ROLES })
      queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] })
    },
  })
}

export function useActualizarPermisosRol() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ rol, permisos }: { rol: string; permisos: Permiso[] }) =>
      container.actualizarPermisosRol.execute(rol, permisos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLAVE_ROLES })
      queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] })
    },
  })
}
