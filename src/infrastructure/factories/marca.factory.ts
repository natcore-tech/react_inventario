// src/infrastructure/factories/marca.factory.ts
import { AxiosMarcaRepository } from '@/infrastructure/adapters/axios-marca.repository'
import { MarcaUseCase } from '@/application/use-cases/marca.use-case'

/**
 * Instancia única del caso de uso de Marca, ya conectada a su
 * implementación concreta (AxiosMarcaRepository).
 * El resto de la app importa `marcaUseCase` y nunca instancia
 * MarcaUseCase ni AxiosMarcaRepository directamente.
 */
export const marcaUseCase = new MarcaUseCase(new AxiosMarcaRepository())
