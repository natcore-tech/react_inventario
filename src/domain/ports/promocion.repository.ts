// src/domain/ports/promocion.repository.ts
import type { Promocion } from '../entities/promocion.entity'
import type { CreatePromocionDto, UpdatePromocionDto } from '@/application/dtos/promocion.dto'

/**
 * Contrato de acceso a datos de Promoción.
 * Implementado por infrastructure/adapters/axios-promocion.repository.ts
 */
export interface PromocionRepository {
  /** GET /promociones/ — Devuelve la lista paginada de promociones. */
  getPromociones(): Promise<Promocion[]>
  /** POST /promociones/ — Crea una nueva promoción y devuelve el objeto creado. */
  createPromocion(dto: CreatePromocionDto): Promise<Promocion>
  /** PATCH /promociones/:id/ — Actualiza parcialmente una promoción. */
  updatePromocion(id: number, dto: UpdatePromocionDto): Promise<Promocion>
  /** DELETE /promociones/:id/ — Elimina una promoción. */
  deletePromocion(id: number): Promise<void>
}
