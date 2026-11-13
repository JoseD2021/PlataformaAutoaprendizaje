import type {
  CategoriaGestion,
  DatosCategoria,
  DatosGuia,
  EstadoGuia,
  GuiaGestionDetalle,
  PaginaGuiasGestion,
} from './entities'

export interface GestionRepository {
  listarGuias(pagina: number, limite: number): Promise<PaginaGuiasGestion>
  obtenerGuia(id: string): Promise<GuiaGestionDetalle | null>
  crearGuia(datos: DatosGuia): Promise<void>
  actualizarGuia(id: string, datos: DatosGuia): Promise<void>
  eliminarGuia(id: string): Promise<void>
  cambiarEstadoGuia(id: string, estado: EstadoGuia): Promise<void>

  listarCategorias(): Promise<CategoriaGestion[]>
  crearCategoria(datos: DatosCategoria): Promise<void>
  actualizarCategoria(id: string, datos: DatosCategoria): Promise<void>
  eliminarCategoria(id: string): Promise<void>
}
