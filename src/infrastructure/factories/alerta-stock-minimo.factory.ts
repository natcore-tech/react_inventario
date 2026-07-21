// src/infrastructure/factories/alerta-stock-minimo.factory.ts
import { AxiosAlertaStockMinimoRepository } from '@/infrastructure/adapters/axios-alerta-stock-minimo.repository'
import { AlertaStockMinimoUseCase } from '@/application/use-cases/alerta-stock-minimo.use-case'

export const alertaStockMinimoUseCase = new AlertaStockMinimoUseCase(new AxiosAlertaStockMinimoRepository())