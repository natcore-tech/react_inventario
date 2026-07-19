// src/domain/ports/unidad-medida.repository.ts
import type { UnidadMedida } from '../entities/unidad-medida.entity'

/**
 * Contrato de acceso a datos para el recurso UnidadMedida.
 * Implementado por infrastructure/adapters/axios-unidad-medida.repository.ts
 */
export interface UnidadMedidaRepository {
  /** Devuelve la lista completa de unidades de medida desde GET /unidades-medida/. */
  getUnidadesMedida(): Promise<UnidadMedida[]>

  /** Obtiene una unidad de medida por su ID. */
  getUnidadMedidaById(id: number): Promise<UnidadMedida>

  /** Crea una nueva unidad de medida. */
  createUnidadMedida(data: Omit<UnidadMedida, 'id' | 'descripcion_completa'>): Promise<UnidadMedida>

  /** Actualiza una unidad de medida existente. */
  updateUnidadMedida(id: number, data: Partial<UnidadMedida>): Promise<UnidadMedida>

  /** Elimina una unidad de medida por su ID. */
  deleteUnidadMedida(id: number): Promise<void>
}
