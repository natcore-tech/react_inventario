// src/infrastructure/adapters/axios-metodo-pago.repository.ts
import { apiClient } from '@/infrastructure/http/axios-client'
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import type { MetodoPagoRepository } from '@/domain/ports/metodo-pago.repository'
import type { MetodoPago } from '@/domain/entities/metodo-pago.entity'
import type { CreateMetodoPagoDto, UpdateMetodoPagoDto } from '@/application/dtos/metodo-pago.dto'

/** Forma de la respuesta paginada de DRF para /metodos-pago/ */
interface PaginatedMetodosPago {
  count: number
  next: string | null
  previous: string | null
  results: MetodoPago[]
}

export class AxiosMetodoPagoRepository implements MetodoPagoRepository {
  /** GET /metodos-pago/ — Extrae los datos de `.results` de la respuesta paginada de DRF. */
  async getMetodosPago(): Promise<MetodoPago[]> {
    try {
      const { data } = await apiClient.get<PaginatedMetodosPago>('/metodos-pago/')
      return data.results
    } catch (err) {
      throw parseApiError(err)
    }
  }

  /** POST /metodos-pago/ — Crea un nuevo método de pago. */
  async createMetodoPago(dto: CreateMetodoPagoDto): Promise<MetodoPago> {
    try {
      const { data } = await apiClient.post<MetodoPago>('/metodos-pago/', dto)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  /** PATCH /metodos-pago/:id/ — Actualiza parcialmente un método de pago. */
  async updateMetodoPago(id: number, dto: UpdateMetodoPagoDto): Promise<MetodoPago> {
    try {
      const { data } = await apiClient.patch<MetodoPago>(`/metodos-pago/${id}/`, dto)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  /** DELETE /metodos-pago/:id/ — El backend aplica soft delete (es_activo = false). */
  async deleteMetodoPago(id: number): Promise<void> {
    try {
      await apiClient.delete(`/metodos-pago/${id}/`)
    } catch (err) {
      throw parseApiError(err)
    }
  }
}
