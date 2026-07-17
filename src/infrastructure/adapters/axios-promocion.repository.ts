// src/infrastructure/adapters/axios-promocion.repository.ts
import { apiClient } from '@/infrastructure/http/axios-client'
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import type { PromocionRepository } from '@/domain/ports/promocion.repository'
import type { Promocion } from '@/domain/entities/promocion.entity'
import type { CreatePromocionDto, UpdatePromocionDto } from '@/application/dtos/promocion.dto'

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

  /** POST /promociones/ — Crea una nueva promoción. */
  async createPromocion(dto: CreatePromocionDto): Promise<Promocion> {
    try {
      const { data } = await apiClient.post<Promocion>('/promociones/', dto)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  /** PATCH /promociones/:id/ — Actualiza parcialmente una promoción. */
  async updatePromocion(id: number, dto: UpdatePromocionDto): Promise<Promocion> {
    try {
      const { data } = await apiClient.patch<Promocion>(`/promociones/${id}/`, dto)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  /** DELETE /promociones/:id/ — Elimina una promoción. */
  async deletePromocion(id: number): Promise<void> {
    try {
      await apiClient.delete(`/promociones/${id}/`)
    } catch (err) {
      throw parseApiError(err)
    }
  }
}
