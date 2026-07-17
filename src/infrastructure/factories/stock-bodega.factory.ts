// src/infrastructure/factories/stock-bodega.factory.ts
import { AxiosStockBodegaRepository } from '@/infrastructure/adapters/axios-stock-bodega.repository'
import { StockBodegaUseCase } from '@/application/use-cases/stock-bodega.use-case'

/**
 * Instancia única del caso de uso de StockBodega, ya conectada a su
 * implementación concreta (AxiosStockBodegaRepository).
 * El resto de la app importa `stockBodegaUseCase` y nunca instancia
 * StockBodegaUseCase ni AxiosStockBodegaRepository directamente.
 */
export const stockBodegaUseCase = new StockBodegaUseCase(new AxiosStockBodegaRepository())
