// src/domain/ports/traslado-bodega-detalle.repository.ts
import type { TrasladoBodegaDetalle } from '../entities/traslado-bodega-detalle.entity'

/**
 * Contrato de acceso a datos para el recurso TrasladoBodegaDetalle.
 * Implementado por infrastructure/adapters/axios-traslado-bodega-detalle.repository.ts
 *
 * NOTA ARQUITECTÓNICA: TrasladoBodegaDetalle no tiene endpoint propio en el backend.
 * Los detalles llegan anidados en GET /traslados-bodegas/.
 * El método getDetallesPorTraslado consulta un traslado específico para extraer sus detalles.
 */
export interface TrasladoBodegaDetalleRepository {
  /**
   * Devuelve los detalles de un traslado específico
   * desde GET /traslados-bodegas/{trasladoId}/.
   */
  getDetallesPorTraslado(trasladoId: number): Promise<TrasladoBodegaDetalle[]>

  /** Agrega un detalle a un traslado existente (generalmente a través de PATCH al traslado) */
  createTrasladoBodegaDetalle(trasladoId: number, detalle: Omit<TrasladoBodegaDetalle, 'id' | 'traslado'>): Promise<TrasladoBodegaDetalle[]>

  /** Actualiza un detalle existente de un traslado */
  updateTrasladoBodegaDetalle(trasladoId: number, detalleId: number, detalle: Partial<Omit<TrasladoBodegaDetalle, 'id' | 'traslado'>>): Promise<TrasladoBodegaDetalle[]>

  /** Elimina un detalle de un traslado */
  deleteTrasladoBodegaDetalle(trasladoId: number, detalleId: number): Promise<TrasladoBodegaDetalle[]>
}
