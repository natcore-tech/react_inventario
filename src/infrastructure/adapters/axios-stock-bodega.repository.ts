// src/infrastructure/adapters/axios-stock-bodega.repository.ts
import { apiClient } from '@/infrastructure/http/axios-client'
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import type { StockBodegaRepository } from '@/domain/ports/stock-bodega.repository'
import type { StockBodega } from '@/domain/entities/stock-bodega.entity'

/** Forma paginada estándar de Django REST Framework. */
interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

/**
 * Implementación concreta del puerto StockBodegaRepository usando Axios.
 * Consume GET /stocks-bodegas/ (registrado en el router como 'stocks-bodegas').
 */
export class AxiosStockBodegaRepository implements StockBodegaRepository {
  /** GET /stocks-bodegas/ — extrae los registros de .results (respuesta paginada de DRF). */
  async getStocksBodegas(): Promise<StockBodega[]> {
    try {
      const { data } = await apiClient.get<PaginatedResponse<StockBodega>>('/stocks-bodegas/')
      return data.results
    } catch (err) {
      throw parseApiError(err)
    }
  }

  /** POST /stocks-bodegas/ */
  async createStockBodega(stockBodega: Omit<StockBodega, 'id' | 'bodega_nombre' | 'producto_nombre'>): Promise<StockBodega> {
    try {
      const { data } = await apiClient.post<StockBodega>('/stocks-bodegas/', stockBodega)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  /** PATCH /stocks-bodegas/{id}/ */
  async updateStockBodega(id: number, stockBodega: Partial<Omit<StockBodega, 'id' | 'bodega_nombre' | 'producto_nombre'>>): Promise<StockBodega> {
    try {
      const { data } = await apiClient.patch<StockBodega>(`/stocks-bodegas/${id}/`, stockBodega)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  /** DELETE /stocks-bodegas/{id}/ */
  async deleteStockBodega(id: number): Promise<void> {
    try {
      await apiClient.delete(`/stocks-bodegas/${id}/`)
    } catch (err) {
      throw parseApiError(err)
    }
  }
}
