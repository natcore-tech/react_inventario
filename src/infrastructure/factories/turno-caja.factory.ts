// src/infrastructure/factories/turno-caja.factory.ts
import { AxiosTurnoCajaRepository } from '../adapters/axios-turno-caja.repository'
import { TurnoCajaUseCase } from '@/application/use-cases/turno-caja.use-case'

const repository = new AxiosTurnoCajaRepository()
export const turnoCajaUseCase = new TurnoCajaUseCase(repository)
