// src/infrastructure/adapters/axios-bodega.repository.ts
import { apiClient } from '@/infrastructure/http/axios-client'
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import type { BodegaRepository } from '@/domain/ports/bodega.repository'
import type { Bodega } from '@/domain/entities/bodega.entity'

/** Forma paginada estándar de Django REST Framework. */
interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

/**
 * Implementación concreta del puerto BodegaRepository usando Axios.
 * Consume GET /bodegas/ (registrado en el router como 'bodegas').
 */
export class AxiosBodegaRepository implements BodegaRepository {
  /** GET /bodegas/ — extrae los registros de .results (respuesta paginada de DRF). */
  async getBodegas(): Promise<Bodega[]> {
    try {
      const { data } = await apiClient.get<PaginatedResponse<Bodega>>('/bodegas/')
      return data.results
    } catch (err) {
      throw parseApiError(err)
    }
  }

  /** POST /bodegas/ */
  async createBodega(bodega: Omit<Bodega, 'id'>): Promise<Bodega> {
    try {
      const { data } = await apiClient.post<Bodega>('/bodegas/', bodega)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  /** PATCH /bodegas/{id}/ */
  async updateBodega(id: number, bodega: Partial<Bodega>): Promise<Bodega> {
    try {
      const { data } = await apiClient.patch<Bodega>(`/bodegas/${id}/`, bodega)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  /** DELETE /bodegas/{id}/ */
  async deleteBodega(id: number): Promise<void> {
    try {
      await apiClient.delete(`/bodegas/${id}/`)
    } catch (err) {
      throw parseApiError(err)
    }
  }
}
