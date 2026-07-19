// src/application/use-cases/bodega.use-case.ts
import type { BodegaRepository } from '@/domain/ports/bodega.repository'
import type { Bodega } from '@/domain/entities/bodega.entity'

/**
 * Caso de uso para el módulo Bodega.
 * Orquesta la lógica de negocio delegando la persistencia al repositorio inyectado.
 */
export class BodegaUseCase {
  private readonly repository: BodegaRepository

  constructor(repository: BodegaRepository) {
    this.repository = repository
  }

  /** Obtiene el listado completo de bodegas. */
  getBodegas(): Promise<Bodega[]> {
    return this.repository.getBodegas()
  }

  createBodega(bodega: Omit<Bodega, 'id'>): Promise<Bodega> {
    return this.repository.createBodega(bodega)
  }

  updateBodega(id: number, bodega: Partial<Bodega>): Promise<Bodega> {
    return this.repository.updateBodega(id, bodega)
  }

  deleteBodega(id: number): Promise<void> {
    return this.repository.deleteBodega(id)
  }
}
