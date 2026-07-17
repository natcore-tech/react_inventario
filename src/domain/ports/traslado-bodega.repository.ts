// src/domain/ports/traslado-bodega.repository.ts
import type { TrasladoBodega } from '../entities/traslado-bodega.entity'

/**
 * Contrato de acceso a datos para el recurso TrasladoBodega.
 * Implementado por infrastructure/adapters/axios-traslado-bodega.repository.ts
 */
export interface TrasladoBodegaRepository {
  /** Devuelve la lista completa de traslados de bodegas desde GET /traslados-bodegas/. */
  getTrasladosBodegas(): Promise<TrasladoBodega[]>
}
