// src/domain/ports/promocion.repository.ts
import type { Promocion } from '../entities/promocion.entity'

/**
 * Contrato de acceso a datos de Promoción.
 * Implementado por infrastructure/adapters/axios-promocion.repository.ts
 */
export interface PromocionRepository {
  /** GET /promociones/ — Devuelve la lista paginada de promociones. */
  getPromociones(): Promise<Promocion[]>
}
