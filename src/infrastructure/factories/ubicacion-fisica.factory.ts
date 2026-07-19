// src/infrastructure/factories/ubicacion-fisica.factory.ts
import { AxiosUbicacionFisicaRepository } from '@/infrastructure/adapters/axios-ubicacion-fisica.repository'
import { UbicacionFisicaUseCase } from '@/application/use-cases/ubicacion-fisica.use-case'

/**
 * Instancia única del caso de uso de UbicacionFisica, ya conectada a su
 * implementación concreta (AxiosUbicacionFisicaRepository).
 * El resto de la app importa `ubicacionFisicaUseCase` y nunca instancia
 * UbicacionFisicaUseCase ni AxiosUbicacionFisicaRepository directamente.
 */
export const ubicacionFisicaUseCase = new UbicacionFisicaUseCase(new AxiosUbicacionFisicaRepository())
