// src/application/use-cases/ajuste-inventario.use-case.ts
import type { AjusteInventarioRepository } from '@/domain/ports/ajuste-inventario.repository'
import type { CreateAjusteInventarioDto } from '@/application/dtos/create-ajuste-inventario.dto'
import type { UpdateAjusteInventarioDto } from '@/application/dtos/update-ajuste-inventario.dto'

export class AjusteInventarioUseCase {
  private repository: AjusteInventarioRepository

  constructor(repository: AjusteInventarioRepository) {
    this.repository = repository
  }

  getAjustes() {
    return this.repository.getAjustes()
  }

  createAjuste(dto: CreateAjusteInventarioDto) {
    return this.repository.createAjuste(dto)
  }

  updateAjuste(id: number, dto: UpdateAjusteInventarioDto) {
    return this.repository.updateAjuste(id, dto)
  }
}