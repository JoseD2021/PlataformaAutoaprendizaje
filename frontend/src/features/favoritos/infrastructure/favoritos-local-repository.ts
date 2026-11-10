import type { Favorito } from '../domain/entities'
import type { FavoritosRepository } from '../domain/favoritos-repository'

const clave = (usuarioId: string) => `clena:favoritos:${usuarioId}`

function leer(usuarioId: string): Favorito[] {
  try {
    const crudo = localStorage.getItem(clave(usuarioId))
    return crudo ? (JSON.parse(crudo) as Favorito[]) : []
  } catch {
    return []
  }
}

function escribir(usuarioId: string, lista: Favorito[]) {
  try {
    localStorage.setItem(clave(usuarioId), JSON.stringify(lista))
  } catch {
    // almacenamiento lleno o bloqueado: no rompemos la pantalla
  }
}

export class FavoritosLocalRepository implements FavoritosRepository {
  async listar(usuarioId: string) {
    return leer(usuarioId)
  }

  async agregar(usuarioId: string, favorito: Favorito) {
    const lista = leer(usuarioId).filter((f) => f.guiaId !== favorito.guiaId)
    escribir(usuarioId, [favorito, ...lista]) // la más reciente primero
  }

  async quitar(usuarioId: string, guiaId: string) {
    escribir(usuarioId, leer(usuarioId).filter((f) => f.guiaId !== guiaId))
  }
}