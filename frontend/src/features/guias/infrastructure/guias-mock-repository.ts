import type { GuiasRepository } from '../domain/guias-repository'
import type { Categoria, GuiaResumen } from '../domain/entities'

const categorias: Categoria[] = [
  { id: 'correo', nombre: 'Correo Gmail', icono: 'mail', esDestacada: true,
    descripcion: 'Entrar a tu correo, escribir un mensaje y mandar fotos a tu familia.' },
  { id: 'tramites', nombre: 'Trámites en línea', icono: 'landmark', esDestacada: false,
    descripcion: 'Citas médicas, certificados y pagos' },
  { id: 'documentos', nombre: 'Documentos', icono: 'file-text', esDestacada: false,
    descripcion: 'Escribir una carta, guardar e imprimir' },
  { id: 'redes', nombre: 'Redes sociales', icono: 'users', esDestacada: false,
    descripcion: 'Facebook y WhatsApp Web' },
  { id: 'seguridad', nombre: 'Seguridad en internet', icono: 'shield', esDestacada: false,
    descripcion: 'Contraseñas, estafas y cerrar sesión' },
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