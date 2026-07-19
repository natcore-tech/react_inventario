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

  async getUnidadMedidaById(id: number): Promise<UnidadMedida> {
    try {
      const { data } = await apiClient.get<UnidadMedida>(`/unidades-medida/${id}/`)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  async createUnidadMedida(unidadData: Omit<UnidadMedida, 'id' | 'descripcion_completa'>): Promise<UnidadMedida> {
    try {
      const { data } = await apiClient.post<UnidadMedida>('/unidades-medida/', unidadData)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  async updateUnidadMedida(id: number, unidadData: Partial<UnidadMedida>): Promise<UnidadMedida> {
    try {
      const { data } = await apiClient.patch<UnidadMedida>(`/unidades-medida/${id}/`, unidadData)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  async deleteUnidadMedida(id: number): Promise<void> {
    try {
      await apiClient.delete(`/unidades-medida/${id}/`)
    } catch (err) {
      throw parseApiError(err)
    }
  }
}
