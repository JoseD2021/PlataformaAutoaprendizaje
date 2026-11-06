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
  { id: 'entrar-correo', titulo: 'Entrar a mi correo', categoriaId: 'correo',
    totalPasos: 3, minutosEstimados: 2, esMasPedida: false },
  { id: 'enviar-correo-foto', titulo: 'Enviar un correo con una foto', categoriaId: 'correo',
    totalPasos: 4, minutosEstimados: 3, esMasPedida: true },
  { id: 'responder-correo', titulo: 'Responder un correo', categoriaId: 'correo',
    totalPasos: 3, minutosEstimados: 2, esMasPedida: false },
  { id: 'crear-cuenta-gmail', titulo: 'Crear una cuenta de Gmail', categoriaId: 'correo',
    totalPasos: 7, minutosEstimados: 10, esMasPedida: false },
  { id: 'cerrar-sesion', titulo: 'Cerrar sesión al terminar', categoriaId: 'correo',
    totalPasos: 2, minutosEstimados: 1, esMasPedida: false,
    etiqueta: 'Importante en computadores públicos' },
]

export class GuiasMockRepository implements GuiasRepository {
  async listarCategorias() { return categorias }
  async listarGuiasPorCategoria(categoriaId: string) {
    return guias.filter((g) => g.categoriaId === categoriaId)
  }
  async obtenerCategoria(id: string) {
  return categorias.find((c) => c.id === id) ?? null
}
}