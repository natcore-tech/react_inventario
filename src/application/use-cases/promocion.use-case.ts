// src/application/use-cases/promocion.use-case.ts
import type { PromocionRepository } from '@/domain/ports/promocion.repository'
import type { Promocion } from '@/domain/entities/promocion.entity'
import type { CreatePromocionDto, UpdatePromocionDto } from '@/application/dtos/promocion.dto'

export class PromocionUseCase {
  private readonly promocionRepository: PromocionRepository

  constructor(promocionRepository: PromocionRepository) {
    this.promocionRepository = promocionRepository
  }

  /** Devuelve todas las promociones del listado paginado. */
  getPromociones(): Promise<Promocion[]> {
    return this.promocionRepository.getPromociones()
  }

  /** Crea una nueva promoción. */
  createPromocion(dto: CreatePromocionDto): Promise<Promocion> {
    return this.promocionRepository.createPromocion(dto)
  }

  /** Actualiza parcialmente una promoción existente (PATCH). */
  updatePromocion(id: number, dto: UpdatePromocionDto): Promise<Promocion> {
    return this.promocionRepository.updatePromocion(id, dto)
  }

  /** Elimina una promoción por su id. */
  deletePromocion(id: number): Promise<void> {
    return this.promocionRepository.deletePromocion(id)
  }
}
