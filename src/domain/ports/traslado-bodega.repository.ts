// src/domain/ports/traslado-bodega.repository.ts
import type { TrasladoBodega } from '../entities/traslado-bodega.entity'

/**
 * Contrato de acceso a datos para el recurso TrasladoBodega.
 * Implementado por infrastructure/adapters/axios-traslado-bodega.repository.ts
 */
export interface TrasladoBodegaRepository {
  /** Devuelve la lista completa de traslados de bodegas desde GET /traslados-bodegas/. */
  getTrasladosBodegas(): Promise<TrasladoBodega[]>
  /** Crea un nuevo traslado POST /traslados-bodegas/. */
  createTrasladoBodega(trasladoBodega: Omit<TrasladoBodega, 'id' | 'fecha_traslado' | 'bodega_origen_nombre' | 'bodega_destino_nombre'>): Promise<TrasladoBodega>
  /** Actualiza un traslado existente PATCH /traslados-bodegas/{id}/. */
  updateTrasladoBodega(id: number, trasladoBodega: Partial<Omit<TrasladoBodega, 'id' | 'fecha_traslado' | 'bodega_origen_nombre' | 'bodega_destino_nombre'>>): Promise<TrasladoBodega>
  /** Elimina un traslado DELETE /traslados-bodegas/{id}/. */
  deleteTrasladoBodega(id: number): Promise<void>
}
