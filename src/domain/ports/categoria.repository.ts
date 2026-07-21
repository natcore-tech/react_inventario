// src/domain/ports/categoria.repository.ts
import type { Categoria } from '../entities/categoria.entity'
import type { CreateCategoriaDto, UpdateCategoriaDto } from '@/application/dtos/categoria.dto'

/**
 * Contrato de acceso a datos de Categoría.
 * Implementado por infrastructure/adapters/axios-categoria.repository.ts
 */
export interface CategoriaRepository {
  /** GET /categorias/ — Devuelve la lista paginada de categorías. */
  getCategorias(): Promise<Categoria[]>
  
  /** POST /categorias/ — Crea una nueva categoría. */
  createCategoria(dto: CreateCategoriaDto): Promise<Categoria>
  
  /** PATCH /categorias/:id/ — Actualiza una categoría. */
  updateCategoria(id: number, dto: UpdateCategoriaDto): Promise<Categoria>
  
  /** DELETE /categorias/:id/ — Elimina (o inactiva) una categoría. */
  deleteCategoria(id: number): Promise<void>
}
