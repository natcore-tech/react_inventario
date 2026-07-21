// src/infrastructure/adapters/axios-categoria.repository.ts
import { apiClient } from '@/infrastructure/http/axios-client'
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import type { CategoriaRepository } from '@/domain/ports/categoria.repository'
import type { Categoria } from '@/domain/entities/categoria.entity'
import type { CreateCategoriaDto, UpdateCategoriaDto } from '@/application/dtos/categoria.dto'

/** Forma de la respuesta paginada de DRF para /categorias/ */
interface PaginatedCategorias {
  count: number
  next: string | null
  previous: string | null
  results: Categoria[]
}

export class AxiosCategoriaRepository implements CategoriaRepository {
  /** GET /categorias/ — Extrae los datos de `.results` de la respuesta paginada de DRF. */
  async getCategorias(): Promise<Categoria[]> {
    try {
      const { data } = await apiClient.get<PaginatedCategorias>('/categorias/')
      return data.results
    } catch (err) {
      throw parseApiError(err)
    }
  }

  /** POST /categorias/ — Crea una nueva categoría. */
  async createCategoria(dto: CreateCategoriaDto): Promise<Categoria> {
    try {
      const { data } = await apiClient.post<Categoria>('/categorias/', dto)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  /** PATCH /categorias/:id/ — Actualiza una categoría. */
  async updateCategoria(id: number, dto: UpdateCategoriaDto): Promise<Categoria> {
    try {
      const { data } = await apiClient.patch<Categoria>(`/categorias/${id}/`, dto)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  /** DELETE /categorias/:id/ — Elimina lógicamente la categoría. */
  async deleteCategoria(id: number): Promise<void> {
    try {
      await apiClient.delete(`/categorias/${id}/`)
    } catch (err) {
      throw parseApiError(err)
    }
  }
}
