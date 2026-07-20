// src/infrastructure/factories/numero-serie.factory.ts
import { AxiosNumeroSerieRepository } from '@/infrastructure/adapters/axios-numero-serie.repository'
import { NumeroSerieUseCase } from '@/application/use-cases/numero-serie.use-case'

export const numeroSerieUseCase = new NumeroSerieUseCase(new AxiosNumeroSerieRepository())