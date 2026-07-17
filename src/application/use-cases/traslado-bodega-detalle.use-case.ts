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
}
