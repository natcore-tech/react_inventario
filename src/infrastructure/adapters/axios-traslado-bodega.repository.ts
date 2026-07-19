// src/infrastructure/adapters/axios-traslado-bodega.repository.ts
import { apiClient } from '@/infrastructure/http/axios-client'
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import type { TrasladoBodegaRepository } from '@/domain/ports/traslado-bodega.repository'
import type { TrasladoBodega } from '@/domain/entities/traslado-bodega.entity'

/** Forma paginada estándar de Django REST Framework. */
interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

/**
 * Implementación concreta del puerto TrasladoBodegaRepository usando Axios.
 * Consume GET /traslados-bodegas/ (registrado en el router como 'traslados-bodegas').
 */
export class AxiosTrasladoBodegaRepository implements TrasladoBodegaRepository {
  /** GET /traslados-bodegas/ — extrae los registros de .results (respuesta paginada de DRF). */
  async getTrasladosBodegas(): Promise<TrasladoBodega[]> {
    try {
      const { data } = await apiClient.get<PaginatedResponse<TrasladoBodega>>('/traslados-bodegas/')
      return data.results
    } catch (err) {
      throw parseApiError(err)
    }
  }

  /** POST /traslados-bodegas/ */
  async createTrasladoBodega(trasladoBodega: Omit<TrasladoBodega, 'id' | 'fecha_traslado' | 'bodega_origen_nombre' | 'bodega_destino_nombre'>): Promise<TrasladoBodega> {
    try {
      const { data } = await apiClient.post<TrasladoBodega>('/traslados-bodegas/', trasladoBodega)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  /** PATCH /traslados-bodegas/{id}/ */
  async updateTrasladoBodega(id: number, trasladoBodega: Partial<Omit<TrasladoBodega, 'id' | 'fecha_traslado' | 'bodega_origen_nombre' | 'bodega_destino_nombre'>>): Promise<TrasladoBodega> {
    try {
      const { data } = await apiClient.patch<TrasladoBodega>(`/traslados-bodegas/${id}/`, trasladoBodega)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  /** DELETE /traslados-bodegas/{id}/ */
  async deleteTrasladoBodega(id: number): Promise<void> {
    try {
      await apiClient.delete(`/traslados-bodegas/${id}/`)
    } catch (err) {
      throw parseApiError(err)
    }
  }
}
