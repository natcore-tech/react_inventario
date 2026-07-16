// src/domain/ports/metodo-pago.repository.ts
import type { MetodoPago } from '../entities/metodo-pago.entity'

/**
 * Contrato de acceso a datos de Método de Pago.
 * Implementado por infrastructure/adapters/axios-metodo-pago.repository.ts
 */
export interface MetodoPagoRepository {
  /** GET /metodos-pago/ — Devuelve la lista paginada de métodos de pago. */
  getMetodosPago(): Promise<MetodoPago[]>
}
