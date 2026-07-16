// src/infrastructure/adapters/axios-promocion.repository.ts
import { apiClient } from '@/infrastructure/http/axios-client'
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import type { PromocionRepository } from '@/domain/ports/promocion.repository'
import type { Promocion } from '@/domain/entities/promocion.entity'

/** Forma de la respuesta paginada de DRF para /promociones/ */
interface PaginatedPromociones {
  count: number
  next: string | null
  previous: string | null
  results: Promocion[]
}

export class AxiosPromocionRepository implements PromocionRepository {
  /** GET /promociones/ — Extrae los datos de `.results` de la respuesta paginada de DRF. */
  async getPromociones(): Promise<Promocion[]> {
    try {
      const { data } = await apiClient.get<PaginatedPromociones>('/promociones/')
      return data.results
    } catch (err) {
      throw parseApiError(err)
    }
  }
}
