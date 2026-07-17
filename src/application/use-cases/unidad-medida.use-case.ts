// src/application/use-cases/unidad-medida.use-case.ts
import type { UnidadMedidaRepository } from '@/domain/ports/unidad-medida.repository'
import type { UnidadMedida } from '@/domain/entities/unidad-medida.entity'

/**
 * Caso de uso para el módulo UnidadMedida.
 * Orquesta la lógica de negocio delegando la persistencia al repositorio inyectado.
 */
export class UnidadMedidaUseCase {
  private readonly repository: UnidadMedidaRepository

  constructor(repository: UnidadMedidaRepository) {
    this.repository = repository
  }

  /** Obtiene el listado completo de unidades de medida. */
  getUnidadesMedida(): Promise<UnidadMedida[]> {
    return this.repository.getUnidadesMedida()
  }
}
