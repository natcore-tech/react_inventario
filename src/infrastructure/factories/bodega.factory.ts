// src/infrastructure/factories/bodega.factory.ts
import { AxiosBodegaRepository } from '@/infrastructure/adapters/axios-bodega.repository'
import { BodegaUseCase } from '@/application/use-cases/bodega.use-case'

/**
 * Instancia única del caso de uso de Bodega, ya conectada a su
 * implementación concreta (AxiosBodegaRepository).
 * El resto de la app importa `bodegaUseCase` y nunca instancia
 * BodegaUseCase ni AxiosBodegaRepository directamente.
 */
export const bodegaUseCase = new BodegaUseCase(new AxiosBodegaRepository())
