// src/application/use-cases/promocion.use-case.ts
import type { PromocionRepository } from '@/domain/ports/promocion.repository'
import type { Promocion } from '@/domain/entities/promocion.entity'

export class PromocionUseCase {
  private readonly promocionRepository: PromocionRepository

  constructor(promocionRepository: PromocionRepository) {
    this.promocionRepository = promocionRepository
  }

  /** Devuelve todas las promociones del listado paginado. */
  getPromociones(): Promise<Promocion[]> {
    return this.promocionRepository.getPromociones()
  }
}
