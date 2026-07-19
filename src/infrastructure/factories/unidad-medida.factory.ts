// src/infrastructure/factories/unidad-medida.factory.ts
import { AxiosUnidadMedidaRepository } from '@/infrastructure/adapters/axios-unidad-medida.repository'
import { UnidadMedidaUseCase } from '@/application/use-cases/unidad-medida.use-case'

/**
 * Instancia única del caso de uso de UnidadMedida, ya conectada a su
 * implementación concreta (AxiosUnidadMedidaRepository).
 * El resto de la app importa `unidadMedidaUseCase` y nunca instancia
 * UnidadMedidaUseCase ni AxiosUnidadMedidaRepository directamente.
 */
export const unidadMedidaUseCase = new UnidadMedidaUseCase(new AxiosUnidadMedidaRepository())
