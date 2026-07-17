// src/application/use-cases/traslado-bodega.use-case.ts
import type { TrasladoBodegaRepository } from '@/domain/ports/traslado-bodega.repository'
import type { TrasladoBodega } from '@/domain/entities/traslado-bodega.entity'

/**
 * Caso de uso para el módulo TrasladoBodega.
 * Orquesta la lógica de negocio delegando la persistencia al repositorio inyectado.
 */
export class TrasladoBodegaUseCase {
  private readonly repository: TrasladoBodegaRepository

  constructor(repository: TrasladoBodegaRepository) {
    this.repository = repository
  }

  /** Obtiene el listado completo de traslados de bodegas. */
  getTrasladosBodegas(): Promise<TrasladoBodega[]> {
    return this.repository.getTrasladosBodegas()
  }
}
