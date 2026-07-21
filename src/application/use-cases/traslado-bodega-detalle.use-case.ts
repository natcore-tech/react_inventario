// src/application/use-cases/traslado-bodega-detalle.use-case.ts
import type { TrasladoBodegaDetalleRepository } from '@/domain/ports/traslado-bodega-detalle.repository'
import type { TrasladoBodegaDetalle } from '@/domain/entities/traslado-bodega-detalle.entity'

/**
 * Caso de uso para el módulo TrasladoBodegaDetalle.
 * Orquesta la lógica de negocio delegando la persistencia al repositorio inyectado.
 */
export class TrasladoBodegaDetalleUseCase {
  private readonly repository: TrasladoBodegaDetalleRepository

  constructor(repository: TrasladoBodegaDetalleRepository) {
    this.repository = repository
  }

  /**
   * Obtiene los detalles de un traslado específico.
   * Los detalles no tienen endpoint propio, se extraen del recurso padre.
   */
  getDetallesPorTraslado(trasladoId: number): Promise<TrasladoBodegaDetalle[]> {
    return this.repository.getDetallesPorTraslado(trasladoId)
  }

  createTrasladoBodegaDetalle(trasladoId: number, detalle: Omit<TrasladoBodegaDetalle, 'id' | 'traslado'>): Promise<TrasladoBodegaDetalle[]> {
    return this.repository.createTrasladoBodegaDetalle(trasladoId, detalle)
  }

  updateTrasladoBodegaDetalle(trasladoId: number, detalleId: number, detalle: Partial<Omit<TrasladoBodegaDetalle, 'id' | 'traslado'>>): Promise<TrasladoBodegaDetalle[]> {
    return this.repository.updateTrasladoBodegaDetalle(trasladoId, detalleId, detalle)
  }

  deleteTrasladoBodegaDetalle(trasladoId: number, detalleId: number): Promise<TrasladoBodegaDetalle[]> {
    return this.repository.deleteTrasladoBodegaDetalle(trasladoId, detalleId)
  }
}
