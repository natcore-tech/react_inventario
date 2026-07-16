// src/application/use-cases/metodo-pago.use-case.ts
import type { MetodoPagoRepository } from '@/domain/ports/metodo-pago.repository'
import type { MetodoPago } from '@/domain/entities/metodo-pago.entity'

export class MetodoPagoUseCase {
  private readonly metodoPagoRepository: MetodoPagoRepository

  constructor(metodoPagoRepository: MetodoPagoRepository) {
    this.metodoPagoRepository = metodoPagoRepository
  }

  /** Devuelve todos los métodos de pago del listado paginado. */
  getMetodosPago(): Promise<MetodoPago[]> {
    return this.metodoPagoRepository.getMetodosPago()
  }
}
