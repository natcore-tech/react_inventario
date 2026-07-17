// src/infrastructure/adapters/axios-ubicacion-fisica.repository.ts
import { apiClient } from '@/infrastructure/http/axios-client'
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import type { UbicacionFisicaRepository } from '@/domain/ports/ubicacion-fisica.repository'
import type { UbicacionFisica } from '@/domain/entities/ubicacion-fisica.entity'

/** Forma paginada estándar de Django REST Framework. */
interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

/**
 * Implementación concreta del puerto UbicacionFisicaRepository usando Axios.
 * Consume GET /ubicaciones/ (registrado en el router como 'ubicaciones').
 */
export class AxiosUbicacionFisicaRepository implements UbicacionFisicaRepository {
  /** GET /ubicaciones/ — extrae los registros de .results (respuesta paginada de DRF). */
  async getUbicaciones(): Promise<UbicacionFisica[]> {
    try {
      const { data } = await apiClient.get<PaginatedResponse<UbicacionFisica>>('/ubicaciones/')
      return data.results
    } catch (err) {
      throw parseApiError(err)
    }
  }
}
