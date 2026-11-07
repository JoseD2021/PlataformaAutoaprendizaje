import type { GuiasRepository } from '../domain/guias-repository'

export class ObtenerGuia {
  private readonly repo: GuiasRepository

  constructor(repo: GuiasRepository) {
    this.repo = repo
  }

  execute(id: string) {
    return this.repo.obtenerGuia(id)
  }
}
