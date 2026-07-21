// src/application/use-cases/categoria.use-case.ts
import type { CategoriaRepository } from '@/domain/ports/categoria.repository'
import type { Categoria } from '@/domain/entities/categoria.entity'
import type { CreateCategoriaDto, UpdateCategoriaDto } from '@/application/dtos/categoria.dto'

export class CategoriaUseCase {
  private readonly categoriaRepository: CategoriaRepository

  constructor(categoriaRepository: CategoriaRepository) {
    this.categoriaRepository = categoriaRepository
  }

  /** Devuelve todas las categorías (lista completa paginada). */
  getCategorias(): Promise<Categoria[]> {
    return this.categoriaRepository.getCategorias()
  }

  createCategoria(dto: CreateCategoriaDto): Promise<Categoria> {
    return this.categoriaRepository.createCategoria(dto)
  }

  updateCategoria(id: number, dto: UpdateCategoriaDto): Promise<Categoria> {
    return this.categoriaRepository.updateCategoria(id, dto)
  }

  deleteCategoria(id: number): Promise<void> {
    return this.categoriaRepository.deleteCategoria(id)
  }
}
