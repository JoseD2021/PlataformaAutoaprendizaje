import type { Favorito } from './entities'

export interface FavoritosRepository {
  listar(usuarioId: string): Promise<Favorito[]>
  agregar(usuarioId: string, favorito: Favorito): Promise<void>
  quitar(usuarioId: string, guiaId: string): Promise<void>
}