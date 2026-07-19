// src/infrastructure/adapters/axios-producto.repository.ts
import { apiClient } from '@/infrastructure/http/axios-client'
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import type { ProductoRepository } from '@/domain/ports/producto.repository'
import type { Producto } from '@/domain/entities/producto.entity'
import type { CreateProductoDto, UpdateProductoDto } from '@/application/dtos/producto.dto'

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

  /** POST /productos/ — Crea un nuevo producto. */
  async createProducto(dto: CreateProductoDto): Promise<Producto> {
    try {
      const { data } = await apiClient.post<Producto>('/productos/', dto)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  /** PATCH /productos/:id/ — Actualiza parcialmente un producto. */
  async updateProducto(id: number, dto: UpdateProductoDto): Promise<Producto> {
    try {
      const { data } = await apiClient.patch<Producto>(`/productos/${id}/`, dto)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  /** DELETE /productos/:id/ — El backend aplica soft delete (es_activo = false). */
  async deleteProducto(id: number): Promise<void> {
    try {
      await apiClient.delete(`/productos/${id}/`)
    } catch (err) {
      throw parseApiError(err)
    }
  }
}
