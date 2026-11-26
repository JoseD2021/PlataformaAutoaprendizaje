import type { DatosCategoria } from '../domain/entities'
import type { GestionRepository } from '../domain/gestion-repository'

export class ActualizarCategoria {
  private readonly repo: GestionRepository

  constructor(repo: GestionRepository) {
    this.repo = repo
  }

  async execute(id: string, datos: DatosCategoria): Promise<void> {
    if (datos.esDestacada) {
      const anteriores = await this.repo.listarCategorias()
      for (const categoria of anteriores.filter((c) => c.esDestacada && c.id !== id)) {
        await this.repo.quitarDestacado(categoria.id)
      }
    }

    await this.repo.actualizarCategoria(id, datos)
  }
}
