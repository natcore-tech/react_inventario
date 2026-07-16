// src/infrastructure/factories/promocion.factory.ts
import { AxiosPromocionRepository } from '@/infrastructure/adapters/axios-promocion.repository'
import { PromocionUseCase } from '@/application/use-cases/promocion.use-case'

/**
 * Instancia única del caso de uso de Promoción, ya conectada a su
 * implementación concreta (AxiosPromocionRepository). El resto de la app importa
 * `promocionUseCase` y nunca instancia PromocionUseCase ni AxiosPromocionRepository directamente.
 */
export const promocionUseCase = new PromocionUseCase(new AxiosPromocionRepository())
