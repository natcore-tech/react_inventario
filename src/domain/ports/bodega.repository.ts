// src/domain/ports/bodega.repository.ts
import type { Bodega } from '../entities/bodega.entity'

/**
 * Contrato de acceso a datos para el recurso Bodega.
 * Implementado por infrastructure/adapters/axios-bodega.repository.ts
 */
export interface BodegaRepository {
  /** Devuelve la lista completa de bodegas desde GET /bodegas/. */
  getBodegas(): Promise<Bodega[]>
}
