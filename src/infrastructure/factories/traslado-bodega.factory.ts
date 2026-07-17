// src/infrastructure/factories/traslado-bodega.factory.ts
import { AxiosTrasladoBodegaRepository } from '@/infrastructure/adapters/axios-traslado-bodega.repository'
import { TrasladoBodegaUseCase } from '@/application/use-cases/traslado-bodega.use-case'

/**
 * Instancia única del caso de uso de TrasladoBodega, ya conectada a su
 * implementación concreta (AxiosTrasladoBodegaRepository).
 * El resto de la app importa `trasladoBodegaUseCase` y nunca instancia
 * TrasladoBodegaUseCase ni AxiosTrasladoBodegaRepository directamente.
 */
export const trasladoBodegaUseCase = new TrasladoBodegaUseCase(new AxiosTrasladoBodegaRepository())
