// src/domain/ports/unidad-medida.repository.ts
import type { UnidadMedida } from '../entities/unidad-medida.entity'

/**
 * Contrato de acceso a datos para el recurso UnidadMedida.
 * Implementado por infrastructure/adapters/axios-unidad-medida.repository.ts
 */
export interface UnidadMedidaRepository {
  /** Devuelve la lista completa de unidades de medida desde GET /unidades-medida/. */
  getUnidadesMedida(): Promise<UnidadMedida[]>
}
