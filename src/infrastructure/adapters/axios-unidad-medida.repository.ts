// src/infrastructure/adapters/axios-unidad-medida.repository.ts
import { apiClient } from '@/infrastructure/http/axios-client'
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import type { UnidadMedidaRepository } from '@/domain/ports/unidad-medida.repository'
import type { UnidadMedida } from '@/domain/entities/unidad-medida.entity'

/** Forma paginada estándar de Django REST Framework. */
interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

/**
 * Implementación concreta del puerto UnidadMedidaRepository usando Axios.
 * Consume GET /unidades-medida/ (registrado en el router como 'unidades-medida').
 */
export class AxiosUnidadMedidaRepository implements UnidadMedidaRepository {
  /** GET /unidades-medida/ — extrae los registros de .results (respuesta paginada de DRF). */
  async getUnidadesMedida(): Promise<UnidadMedida[]> {
    try {
      const { data } = await apiClient.get<PaginatedResponse<UnidadMedida>>('/unidades-medida/')
      return data.results
    } catch (err) {
      throw parseApiError(err)
    }
  }
}
