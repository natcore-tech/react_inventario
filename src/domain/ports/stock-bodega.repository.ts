// src/domain/ports/stock-bodega.repository.ts
import type { StockBodega } from '../entities/stock-bodega.entity'

/**
 * Contrato de acceso a datos para el recurso StockBodega.
 * Implementado por infrastructure/adapters/axios-stock-bodega.repository.ts
 */
export interface StockBodegaRepository {
  /** Devuelve la lista completa de stocks en bodegas desde GET /stocks-bodegas/. */
  getStocksBodegas(): Promise<StockBodega[]>
  /** Crea un nuevo stock en bodega POST /stocks-bodegas/. */
  createStockBodega(stockBodega: Omit<StockBodega, 'id' | 'bodega_nombre' | 'producto_nombre'>): Promise<StockBodega>
  /** Actualiza un stock existente PATCH /stocks-bodegas/{id}/. */
  updateStockBodega(id: number, stockBodega: Partial<Omit<StockBodega, 'id' | 'bodega_nombre' | 'producto_nombre'>>): Promise<StockBodega>
  /** Elimina un stock DELETE /stocks-bodegas/{id}/. */
  deleteStockBodega(id: number): Promise<void>
}
