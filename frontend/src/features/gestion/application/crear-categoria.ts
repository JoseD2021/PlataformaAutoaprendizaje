import type { DatosCategoria } from '../domain/entities'
import type { GestionRepository } from '../domain/gestion-repository'

export class CrearCategoria {
  private readonly repo: GestionRepository

  constructor(repo: GestionRepository) {
    this.repo = repo
  }

  async execute(datos: DatosCategoria): Promise<void> {
    if (datos.esDestacada) {
      const anteriores = await this.repo.listarCategorias()
      for (const categoria of anteriores.filter((c) => c.esDestacada)) {
        await this.repo.quitarDestacado(categoria.id)
      }
    }

    await this.repo.crearCategoria(datos)
  }
}
