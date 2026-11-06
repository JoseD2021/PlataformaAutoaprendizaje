import type { GuiasRepository } from '../domain/guias-repository'
import type { Categoria, GuiaResumen } from '../domain/entities'

const categorias: Categoria[] = [
  { id: 'correo', nombre: 'Correo electrónico', ilustracionUrl: '/ilustraciones/correo.svg' },
  { id: 'busqueda', nombre: 'Buscar en internet', ilustracionUrl: '/ilustraciones/busqueda.svg' },
  { id: 'documentos', nombre: 'Documentos', ilustracionUrl: '/ilustraciones/documentos.svg' },
  { id: 'redes', nombre: 'Redes sociales', ilustracionUrl: '/ilustraciones/redes.svg' },
  { id: 'seguridad', nombre: 'Seguridad digital', ilustracionUrl: '/ilustraciones/seguridad.svg' },
]

const guias: GuiaResumen[] = [
  { id: 'enviar-foto', titulo: 'Enviar una foto por correo', categoriaId: 'correo' },
  { id: 'imprimir', titulo: 'Imprimir un documento', categoriaId: 'documentos' },
]

export class GuiasMockRepository implements GuiasRepository {
  async listarCategorias() { return categorias }
  async listarGuiasPorCategoria(categoriaId: string) {
    return guias.filter((g) => g.categoriaId === categoriaId)
  }
}