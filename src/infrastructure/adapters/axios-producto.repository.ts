// src/infrastructure/adapters/axios-producto.repository.ts
import { apiClient } from '@/infrastructure/http/axios-client'
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import type { ProductoRepository } from '@/domain/ports/producto.repository'
import type { Producto } from '@/domain/entities/producto.entity'

/** Forma de la respuesta paginada de DRF para /productos/ */
interface PaginatedProductos {
  count: number
  next: string | null
  previous: string | null
  results: Producto[]
}

export class AxiosProductoRepository implements ProductoRepository {
  /** GET /productos/ — Extrae los datos de `.results` de la respuesta paginada de DRF. */
  async getProductos(): Promise<Producto[]> {
    try {
      const { data } = await apiClient.get<PaginatedProductos>('/productos/')
      return data.results
    } catch (err) {
      throw parseApiError(err)
    }
  }
}
