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

  createTrasladoBodega(trasladoBodega: Omit<TrasladoBodega, 'id' | 'fecha_traslado' | 'bodega_origen_nombre' | 'bodega_destino_nombre'>): Promise<TrasladoBodega> {
    return this.repository.createTrasladoBodega(trasladoBodega)
  }

  updateTrasladoBodega(id: number, trasladoBodega: Partial<Omit<TrasladoBodega, 'id' | 'fecha_traslado' | 'bodega_origen_nombre' | 'bodega_destino_nombre'>>): Promise<TrasladoBodega> {
    return this.repository.updateTrasladoBodega(id, trasladoBodega)
  }

  deleteTrasladoBodega(id: number): Promise<void> {
    return this.repository.deleteTrasladoBodega(id)
  }
}
