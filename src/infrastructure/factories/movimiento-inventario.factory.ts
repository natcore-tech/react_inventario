// src/infrastructure/factories/movimiento-inventario.factory.ts
import { AxiosMovimientoInventarioRepository } from '../adapters/axios-movimiento-inventario.repository'
import { MovimientoInventarioUseCase } from '@/application/use-cases/movimiento-inventario.use-case'

const repository = new AxiosMovimientoInventarioRepository()
export const movimientoInventarioUseCase = new MovimientoInventarioUseCase(repository)
