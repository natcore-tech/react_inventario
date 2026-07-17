// src/domain/ports/metodo-pago.repository.ts
import type { MetodoPago } from '../entities/metodo-pago.entity'
import type { CreateMetodoPagoDto, UpdateMetodoPagoDto } from '@/application/dtos/metodo-pago.dto'

/**
 * Contrato de acceso a datos de Método de Pago.
 * Implementado por infrastructure/adapters/axios-metodo-pago.repository.ts
 */
export interface MetodoPagoRepository {
  /** GET /metodos-pago/ — Devuelve la lista paginada de métodos de pago. */
  getMetodosPago(): Promise<MetodoPago[]>
  /** POST /metodos-pago/ — Crea un nuevo método de pago. */
  createMetodoPago(dto: CreateMetodoPagoDto): Promise<MetodoPago>
  /** PATCH /metodos-pago/:id/ — Actualiza parcialmente un método de pago. */
  updateMetodoPago(id: number, dto: UpdateMetodoPagoDto): Promise<MetodoPago>
  /** DELETE /metodos-pago/:id/ — Soft delete (es_activo = false). */
  deleteMetodoPago(id: number): Promise<void>
}
