// src/infrastructure/factories/venta.factory.ts
import { AxiosVentaRepository } from '../adapters/axios-venta.repository'
import { VentaUseCase } from '@/application/use-cases/venta.use-case'

const repository = new AxiosVentaRepository()
export const ventaUseCase = new VentaUseCase(repository)
