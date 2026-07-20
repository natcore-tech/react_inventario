// src/infrastructure/adapters/axios-categoria.repository.ts
import { apiClient } from '@/infrastructure/http/axios-client'
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import type { CategoriaRepository } from '@/domain/ports/categoria.repository'
import type { Categoria } from '@/domain/entities/categoria.entity'

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
}
