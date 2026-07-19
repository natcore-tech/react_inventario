// src/application/use-cases/marca.use-case.ts
import { Marca } from '@/domain/entities/marca.entity'
import type { MarcaRepository } from '@/domain/ports/marca.repository'

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

  /** Obtiene una marca por su ID. */
  getMarcaById(id: number): Promise<Marca> {
    return this.repository.getMarcaById(id)
  }

  /** Crea una nueva marca. */
  createMarca(data: Omit<Marca, 'id'>): Promise<Marca> {
    return this.repository.createMarca(data)
  }

  /** Actualiza una marca existente. */
  updateMarca(id: number, data: Partial<Marca>): Promise<Marca> {
    return this.repository.updateMarca(id, data)
  }

  /** Elimina una marca por su ID. */
  deleteMarca(id: number): Promise<void> {
    return this.repository.deleteMarca(id)
  }
}
