// src/infrastructure/factories/metodo-pago.factory.ts
import { AxiosMetodoPagoRepository } from '@/infrastructure/adapters/axios-metodo-pago.repository'
import { MetodoPagoUseCase } from '@/application/use-cases/metodo-pago.use-case'

/**
 * Instancia única del caso de uso de Método de Pago, ya conectada a su
 * implementación concreta (AxiosMetodoPagoRepository). El resto de la app importa
 * `metodoPagoUseCase` y nunca instancia MetodoPagoUseCase ni AxiosMetodoPagoRepository directamente.
 */
export const metodoPagoUseCase = new MetodoPagoUseCase(new AxiosMetodoPagoRepository())
