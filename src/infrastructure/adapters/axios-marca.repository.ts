// src/infrastructure/adapters/axios-marca.repository.ts
import { apiClient } from '@/infrastructure/http/axios-client'
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import type { MarcaRepository } from '@/domain/ports/marca.repository'
import type { Marca } from '@/domain/entities/marca.entity'

/** Forma paginada estándar de Django REST Framework. */
interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

/**
 * Implementación concreta del puerto MarcaRepository usando Axios.
 * Consume GET /marcas/ (registrado en el router como 'marcas').
 */
export class AxiosMarcaRepository implements MarcaRepository {
  /** GET /marcas/ — extrae los registros de .results (respuesta paginada de DRF). */
  async getMarcas(): Promise<Marca[]> {
    try {
      const { data } = await apiClient.get<PaginatedResponse<Marca>>('/marcas/')
      return data.results
    } catch (err) {
      throw parseApiError(err)
    }
  }
}
