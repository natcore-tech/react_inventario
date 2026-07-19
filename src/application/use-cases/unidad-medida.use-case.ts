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

  /** Obtiene una unidad de medida por su ID. */
  getUnidadMedidaById(id: number): Promise<UnidadMedida> {
    return this.repository.getUnidadMedidaById(id)
  }

  /** Crea una nueva unidad de medida. */
  createUnidadMedida(data: Omit<UnidadMedida, 'id' | 'descripcion_completa'>): Promise<UnidadMedida> {
    return this.repository.createUnidadMedida(data)
  }

  /** Actualiza una unidad de medida existente. */
  updateUnidadMedida(id: number, data: Partial<UnidadMedida>): Promise<UnidadMedida> {
    return this.repository.updateUnidadMedida(id, data)
  }

  /** Elimina una unidad de medida por su ID. */
  deleteUnidadMedida(id: number): Promise<void> {
    return this.repository.deleteUnidadMedida(id)
  }
}
