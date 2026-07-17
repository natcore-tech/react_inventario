// src/domain/ports/stock-bodega.repository.ts
import type { StockBodega } from '../entities/stock-bodega.entity'

/**
 * Contrato de acceso a datos para el recurso StockBodega.
 * Implementado por infrastructure/adapters/axios-stock-bodega.repository.ts
 */
export interface StockBodegaRepository {
  /** Devuelve la lista completa de stocks en bodegas desde GET /stocks-bodegas/. */
  getStocksBodegas(): Promise<StockBodega[]>
}
