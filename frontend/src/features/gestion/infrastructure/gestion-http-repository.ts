import axios, { type AxiosInstance } from 'axios'
import { httpClient } from '../../../shared/http/client'
import {
  ErrorGestion,
  type CategoriaGestion,
  type DatosCategoria,
  type DatosGuia,
  type EstadoGuia,
  type GuiaGestionDetalle,
  type GuiaGestionResumen,
  type PaginaGuiasGestion,
} from '../domain/entities'
import type { GestionRepository } from '../domain/gestion-repository'

interface GuiaResumenDto {
  id: string
  titulo: string
  categoriaId: string
  totalPasos: number
  minutosEstimados: number
  esMasPedida: boolean
  etiqueta?: string | null
  estado: EstadoGuia
}

interface PaginaGuiasDto {
  items: GuiaResumenDto[]
  total: number
  page: number
  limit: number
}

interface PasoDto {
  orden?: number
  tituloCorto: string
  accion: string
  descripcion: string
  imagenUrl?: string | null
  pieImagen?: string | null
}

interface GuiaDetalleDto extends GuiaResumenDto {
  palabrasClave?: string | null
  pasos: PasoDto[]
}

interface CategoriaDto {
  id: string
  name: string
  slug?: string
  iconName: string
  description: string
  isFeatured: boolean
}

function mapearResumen(dto: GuiaResumenDto): GuiaGestionResumen {
  return {
    id: dto.id,
    titulo: dto.titulo,
    categoriaId: dto.categoriaId,
    totalPasos: dto.totalPasos,
    minutosEstimados: dto.minutosEstimados,
    esMasPedida: dto.esMasPedida,
    etiqueta: dto.etiqueta ?? undefined,
    estado: dto.estado,
  }
}

function mapearDetalle(dto: GuiaDetalleDto): GuiaGestionDetalle {
  return {
    id: dto.id,
    estado: dto.estado,
    titulo: dto.titulo,
    categoriaId: dto.categoriaId,
    minutosEstimados: dto.minutosEstimados,
    esMasPedida: dto.esMasPedida,
    etiqueta: dto.etiqueta ?? '',
    palabrasClave: dto.palabrasClave ?? '',
    pasos: [...dto.pasos]
      .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
      .map((p) => ({
        tituloCorto: p.tituloCorto,
        accion: p.accion,
        descripcion: p.descripcion,
        imagenUrl: p.imagenUrl ?? '',
        pieImagen: p.pieImagen ?? '',
      })),
  }
}

function aPayloadGuia(datos: DatosGuia) {
  return {
    titulo: datos.titulo.trim(),
    categoriaId: datos.categoriaId,
    minutosEstimados: datos.minutosEstimados,
    esMasPedida: datos.esMasPedida,
    etiqueta: datos.etiqueta.trim() || undefined,
    palabrasClave: datos.palabrasClave.trim() || undefined,
    pasos: datos.pasos.map((p) => ({
      tituloCorto: p.tituloCorto.trim(),
      accion: p.accion.trim(),
      descripcion: p.descripcion.trim(),
      imagenUrl: p.imagenUrl.trim() || undefined,
      pieImagen: p.pieImagen.trim() || undefined,
    })),
  }
}

function aPayloadCategoria(datos: DatosCategoria) {
  return {
    name: datos.nombre.trim(),
    iconName: datos.icono,
    description: datos.descripcion.trim(),
    isFeatured: datos.esDestacada,
  }
}

export class GestionHttpRepository implements GestionRepository {
  private readonly http: AxiosInstance

  constructor(http: AxiosInstance = httpClient) {
    this.http = http
  }

  async listarGuias(pagina: number, limite: number): Promise<PaginaGuiasGestion> {
    const { data } = await this.http.get<PaginaGuiasDto>('/management/guides', {
      params: { page: pagina, limit: limite },
    })
    return {
      items: data.items.map(mapearResumen),
      total: data.total,
      pagina: data.page,
      limite: data.limit,
    }
  }

  async obtenerGuia(id: string): Promise<GuiaGestionDetalle | null> {
    try {
      const { data } = await this.http.get<GuiaDetalleDto>(
        `/management/guides/${encodeURIComponent(id)}`,
      )
      return mapearDetalle(data)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) return null
      throw error
    }
  }

  async crearGuia(datos: DatosGuia): Promise<void> {
    await this.http.post('/management/guides', aPayloadGuia(datos))
  }

  async actualizarGuia(id: string, datos: DatosGuia): Promise<void> {
    await this.http.put(`/management/guides/${encodeURIComponent(id)}`, aPayloadGuia(datos))
  }

  async eliminarGuia(id: string): Promise<void> {
    await this.http.delete(`/management/guides/${encodeURIComponent(id)}`)
  }

  async cambiarEstadoGuia(id: string, estado: EstadoGuia): Promise<void> {
    await this.http.patch(`/management/guides/${encodeURIComponent(id)}/status`, { estado })
  }

  async listarCategorias(): Promise<CategoriaGestion[]> {
    const { data } = await this.http.get<CategoriaDto[]>('/categories')
    return data.map((c) => ({
      id: c.id,
      nombre: c.name,
      slug: c.slug,
      icono: c.iconName,
      descripcion: c.description,
      esDestacada: c.isFeatured,
    }))
  }

  async crearCategoria(datos: DatosCategoria): Promise<void> {
    await this.http.post('/categories', aPayloadCategoria(datos))
  }

  async actualizarCategoria(id: string, datos: DatosCategoria): Promise<void> {
    await this.http.patch(`/categories/${encodeURIComponent(id)}`, aPayloadCategoria(datos))
  }

  async eliminarCategoria(id: string): Promise<void> {
    try {
      await this.http.delete(`/categories/${encodeURIComponent(id)}`)
    } catch (error) {
      // Hoy el backend responde 500 cuando la categoría tiene guías (debería ser 409).
      if (axios.isAxiosError(error) && [409, 500].includes(error.response?.status ?? 0)) {
        throw new ErrorGestion(
          'No se pudo eliminar la categoría. Si tiene guías, muévelas a otra categoría o elimínalas primero.',
        )
      }
      throw error
    }
  }
}
