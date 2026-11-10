import axios, { type AxiosInstance } from 'axios'
import type { GuiasRepository, PaginaBusquedaGuias } from '../domain/guias-repository'
import type { Categoria, GuiaDetalle, GuiaResumen, Paso, ResultadoBusquedaGuia } from '../domain/entities'
import { httpClient } from '../../../shared/http/client'

interface CategoriaBackendDto {
  id: string
  name: string
  slug?: string
  iconName: string
  description: string
  isFeatured: boolean
}

interface GuiaResumenBackendDto {
  id: string
  titulo: string
  categoriaId: string
  totalPasos: number
  minutosEstimados: number
  esMasPedida: boolean
  etiqueta?: string
}

interface PaginatedGuiasBackendDto {
  items: GuiaResumenBackendDto[]
  total: number
  page: number
  limit: number
}

interface PasoGuiaBackendDto {
  orden: number
  tituloCorto: string
  accion: string
  descripcion: string
  imagenUrl?: string
  pieImagen?: string
}

interface GuiaDetalleBackendDto extends GuiaResumenBackendDto {
  pasos: PasoGuiaBackendDto[]
}

interface ResultadoBusquedaBackendDto {
  id: string
  title: string
  estimatedMinutes: number
  categoryName: string
}

interface BusquedaGuiasBackendDto {
  items: ResultadoBusquedaBackendDto[]
  total: number
  page: number
  limit: number
  totalPages: number
}

function mapearPaso(pasoDto: PasoGuiaBackendDto): Paso {
  const imagenUrl = pasoDto.imagenUrl?.trim() || '/svg/notfound.svg'
  const imagenAlt =
    pasoDto.pieImagen?.trim()
      ? pasoDto.pieImagen
      : `Ilustración del paso ${pasoDto.orden}: ${pasoDto.accion || pasoDto.tituloCorto}`

  return {
    id: String(pasoDto.orden),
    numero: pasoDto.orden,
    titulo: pasoDto.accion || pasoDto.tituloCorto,
    texto: pasoDto.descripcion,
    imagenUrl,
    imagenAlt,
  }
}

function mapearGuiaDetalle(dto: GuiaDetalleBackendDto): GuiaDetalle {
  return {
    id: dto.id,
    titulo: dto.titulo,
    categoriaId: dto.categoriaId,
    totalPasos: dto.totalPasos,
    minutosEstimados: dto.minutosEstimados,
    esMasPedida: dto.esMasPedida,
    etiqueta: dto.etiqueta,
    pasos: dto.pasos.map(mapearPaso),
  }
}

export class GuiasHttpRepository implements GuiasRepository {
  private readonly http: AxiosInstance

  constructor(http: AxiosInstance = httpClient) {
    this.http = http
  }

  async listarCategorias(): Promise<Categoria[]> {
    const { data } = await this.http.get<CategoriaBackendDto[]>('/categories')
    return data.map((item) => ({
      id: item.id,
      nombre: item.name,
      descripcion: item.description,
      icono: item.iconName,
      esDestacada: item.isFeatured,
      slug: item.slug,
    }))
  }

  async obtenerCategoria(id: string): Promise<Categoria | null> {
    const categorias = await this.listarCategorias()
    return categorias.find((c) => c.id === id || c.slug === id) ?? null
  }

  async listarGuiasPorCategoria(categoriaId: string): Promise<GuiaResumen[]> {
    const { data } = await this.http.get<PaginatedGuiasBackendDto>('/guides', {
      params: {
        categoriaId,
        limit: 100,
      },
    })

    return data.items.map((item) => ({
      id: item.id,
      titulo: item.titulo,
      categoriaId: item.categoriaId,
      totalPasos: item.totalPasos,
      minutosEstimados: item.minutosEstimados,
      esMasPedida: item.esMasPedida,
      etiqueta: item.etiqueta,
    }))
  }

  async obtenerGuia(id: string): Promise<GuiaDetalle | null> {
    try {
      const { data } = await this.http.get<GuiaDetalleBackendDto>(
        `/guides/${encodeURIComponent(id)}`,
      )
      return mapearGuiaDetalle(data)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null
      }
      throw error
    }
  }

  async buscarGuias(consulta: string, pagina: number, limite: number): Promise<PaginaBusquedaGuias> {
    try {
      const { data } = await this.http.get<BusquedaGuiasBackendDto>('/guides/search', {
        params: { q: consulta, page: pagina, limit: limite },
      })

      const items: ResultadoBusquedaGuia[] = data.items.map((item) => ({
        id: item.id,
        titulo: item.title,
        minutosEstimados: item.estimatedMinutes,
        nombreCategoria: item.categoryName,
      }))

      return {
        items,
        total: data.total,
        pagina: data.page,
        totalPaginas: data.totalPages,
      }
    } catch (error) {
      // 400 = consulta inválida para el backend (p. ej. solo palabras vacías):
      // la tratamos como "sin resultados" en lugar de un error de red.
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        return { items: [], total: 0, pagina, totalPaginas: 0 }
      }
      throw error
    }
  }
}
