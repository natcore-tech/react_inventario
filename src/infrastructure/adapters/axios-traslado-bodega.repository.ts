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
}
