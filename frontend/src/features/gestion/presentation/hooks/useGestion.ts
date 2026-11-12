import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { container } from '../../../../app/container'
import type { DatosCategoria, DatosGuia, EstadoGuia } from '../../domain/entities'

const LIMITE_LISTADO = 100

export function useGuiasGestion() {
  return useQuery({
    queryKey: ['gestion', 'guias'],
    queryFn: () => container.listarGuiasGestion.execute(1, LIMITE_LISTADO),
  })
}

export function useGuiaGestion(id: string | undefined) {
  return useQuery({
    queryKey: ['gestion', 'guia', id],
    queryFn: () => container.obtenerGuiaGestion.execute(id ?? ''),
    enabled: Boolean(id),
  })
}

export function useCategoriasGestion() {
  return useQuery({
    queryKey: ['gestion', 'categorias'],
    queryFn: () => container.listarCategoriasGestion.execute(),
  })
}

export function useMutacionesGestion() {
  const queryClient = useQueryClient()

  // Refresca también lo que ve el público (inicio, listado por tema y guía).
  const refrescar = () =>
    Promise.all(
      [['gestion'], ['categorias'], ['categoria'], ['guias'], ['guia']].map((queryKey) =>
        queryClient.invalidateQueries({ queryKey }),
      ),
    )

  const crearGuia = useMutation({
    mutationFn: (datos: DatosGuia) => container.crearGuia.execute(datos),
    onSuccess: refrescar,
  })
  const actualizarGuia = useMutation({
    mutationFn: ({ id, datos }: { id: string; datos: DatosGuia }) =>
      container.actualizarGuia.execute(id, datos),
    onSuccess: refrescar,
  })
  const eliminarGuia = useMutation({
    mutationFn: (id: string) => container.eliminarGuia.execute(id),
    onSuccess: refrescar,
  })
  const cambiarEstado = useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: EstadoGuia }) =>
      container.cambiarEstadoGuia.execute(id, estado),
    onSuccess: refrescar,
  })
  const crearCategoria = useMutation({
    mutationFn: (datos: DatosCategoria) => container.crearCategoria.execute(datos),
    onSuccess: refrescar,
  })
  const actualizarCategoria = useMutation({
    mutationFn: ({ id, datos }: { id: string; datos: DatosCategoria }) =>
      container.actualizarCategoria.execute(id, datos),
    onSuccess: refrescar,
  })
  const eliminarCategoria = useMutation({
    mutationFn: (id: string) => container.eliminarCategoria.execute(id),
    onSuccess: refrescar,
  })

  return {
    crearGuia,
    actualizarGuia,
    eliminarGuia,
    cambiarEstado,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
  }
}
