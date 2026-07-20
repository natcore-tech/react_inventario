// src/application/use-cases/categoria.use-case.ts
import type { CategoriaRepository } from '@/domain/ports/categoria.repository'
import type { Categoria } from '@/domain/entities/categoria.entity'

export class CategoriaUseCase {
  private readonly categoriaRepository: CategoriaRepository

  constructor(categoriaRepository: CategoriaRepository) {
    this.categoriaRepository = categoriaRepository
  }

  /** Devuelve todas las categorías (lista completa paginada). */
  getCategorias(): Promise<Categoria[]> {
    return this.categoriaRepository.getCategorias()
  }
}
