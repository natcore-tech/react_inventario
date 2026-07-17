// src/application/use-cases/stock-bodega.use-case.ts
import type { StockBodegaRepository } from '@/domain/ports/stock-bodega.repository'
import type { StockBodega } from '@/domain/entities/stock-bodega.entity'

/**
 * Caso de uso para el módulo StockBodega.
 * Orquesta la lógica de negocio delegando la persistencia al repositorio inyectado.
 */
export class StockBodegaUseCase {
  private readonly repository: StockBodegaRepository

  constructor(repository: StockBodegaRepository) {
    this.repository = repository
  }

  /** Obtiene el listado completo de stocks en bodegas. */
  getStocksBodegas(): Promise<StockBodega[]> {
    return this.repository.getStocksBodegas()
  }
}
