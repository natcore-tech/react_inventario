// src/infrastructure/adapters/axios-metodo-pago.repository.ts
import { apiClient } from '@/infrastructure/http/axios-client'
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import type { MetodoPagoRepository } from '@/domain/ports/metodo-pago.repository'
import type { MetodoPago } from '@/domain/entities/metodo-pago.entity'

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
}
