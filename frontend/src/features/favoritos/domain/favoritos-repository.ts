import type { GuiaResumen } from '../../guias/domain/entities'

export interface FavoritosRepository {
  listar(): Promise<GuiaResumen[]>
  agregar(guiaId: string): Promise<void>
  quitar(guiaId: string): Promise<void>
}
