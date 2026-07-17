// src/application/use-cases/marca.use-case.ts
import type { MarcaRepository } from '@/domain/ports/marca.repository'
import type { Marca } from '@/domain/entities/marca.entity'

/**
 * Caso de uso para el módulo Marca.
 * Orquesta la lógica de negocio delegando la persistencia al repositorio inyectado.
 */
export class MarcaUseCase {
  private readonly repository: MarcaRepository

  constructor(repository: MarcaRepository) {
    this.repository = repository
  }

  /** Obtiene el listado completo de marcas activas. */
  getMarcas(): Promise<Marca[]> {
    return this.repository.getMarcas()
  }
}
