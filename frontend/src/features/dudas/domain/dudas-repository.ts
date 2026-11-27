import type { CategoriaDuda, Duda, NuevaDuda } from './entities'

export interface DudasRepository {
  listar(): Promise<Duda[]>
  anotar(nueva: NuevaDuda): Promise<Duda>
  eliminar(id: string): Promise<void>
  listarCategorias(): Promise<CategoriaDuda[]>
}
