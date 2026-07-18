// src/domain/ports/categoria.repository.ts
import type { Categoria } from '../entities/categoria.entity'

/**
 * Contrato de acceso a datos de Categoría.
 * Implementado por infrastructure/adapters/axios-categoria.repository.ts
 */
export interface CategoriaRepository {
  /** GET /categorias/ — Devuelve la lista paginada de categorías. */
  getCategorias(): Promise<Categoria[]>
}
