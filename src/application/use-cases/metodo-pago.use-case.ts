// src/application/use-cases/metodo-pago.use-case.ts
import type { MetodoPagoRepository } from '@/domain/ports/metodo-pago.repository'
import type { MetodoPago } from '@/domain/entities/metodo-pago.entity'
import type { CreateMetodoPagoDto, UpdateMetodoPagoDto } from '@/application/dtos/metodo-pago.dto'

export class MetodoPagoUseCase {
  private readonly metodoPagoRepository: MetodoPagoRepository

  constructor(metodoPagoRepository: MetodoPagoRepository) {
    this.metodoPagoRepository = metodoPagoRepository
  }

  /** Devuelve todos los métodos de pago del listado paginado. */
  getMetodosPago(): Promise<MetodoPago[]> {
    return this.metodoPagoRepository.getMetodosPago()
  }

  /** Crea un nuevo método de pago. */
  createMetodoPago(dto: CreateMetodoPagoDto): Promise<MetodoPago> {
    return this.metodoPagoRepository.createMetodoPago(dto)
  }

  /** Actualiza parcialmente un método de pago existente (PATCH). */
  updateMetodoPago(id: number, dto: UpdateMetodoPagoDto): Promise<MetodoPago> {
    return this.metodoPagoRepository.updateMetodoPago(id, dto)
  }

  /** Elimina (soft delete) un método de pago por su id. */
  deleteMetodoPago(id: number): Promise<void> {
    return this.metodoPagoRepository.deleteMetodoPago(id)
  }
}
