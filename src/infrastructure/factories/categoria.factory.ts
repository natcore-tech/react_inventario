// src/infrastructure/factories/categoria.factory.ts
import { AxiosCategoriaRepository } from '@/infrastructure/adapters/axios-categoria.repository'
import { CategoriaUseCase } from '@/application/use-cases/categoria.use-case'

/**
 * Instancia única del caso de uso de Categoría, ya conectada a su
 * implementación concreta (AxiosCategoriaRepository). El resto de la app importa
 * `categoriaUseCase` y nunca instancia CategoriaUseCase ni AxiosCategoriaRepository directamente.
 */
export const categoriaUseCase = new CategoriaUseCase(new AxiosCategoriaRepository())
