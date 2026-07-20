// src/presentation/store/stock-bodega.store.ts
import { create } from 'zustand'
import { StockBodegaUseCase } from '@/application/use-cases/stock-bodega.use-case'
import { AxiosStockBodegaRepository } from '@/infrastructure/adapters/axios-stock-bodega.repository'
import type { StockBodega } from '@/domain/entities/stock-bodega.entity'

interface StockBodegaState {
  stocks: StockBodega[]
  loading: boolean
  error: string | null
  fetchStocks: () => Promise<void>
  createStockBodega: (stockBodega: Omit<StockBodega, 'id' | 'bodega_nombre' | 'producto_nombre'>) => Promise<void>
  updateStockBodega: (id: number, stockBodega: Partial<Omit<StockBodega, 'id' | 'bodega_nombre' | 'producto_nombre'>>) => Promise<void>
  deleteStockBodega: (id: number) => Promise<void>
}

const useCase = new StockBodegaUseCase(new AxiosStockBodegaRepository())

export const useStockBodegaStore = create<StockBodegaState>((set, get) => ({
  stocks: [],
  loading: false,
  error: null,

  fetchStocks: async () => {
    set({ loading: true, error: null })
    try {
      const stocks = await useCase.getStocksBodegas()
      set({ stocks, loading: false })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar stocks'
      set({ error: message, loading: false })
    }
  },

  createStockBodega: async (stockBodega) => {
    set({ loading: true, error: null })
    try {
      await useCase.createStockBodega(stockBodega)
      await get().fetchStocks()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear stock'
      set({ error: message, loading: false })
      throw err
    }
  },

  updateStockBodega: async (id, stockBodega) => {
    set({ loading: true, error: null })
    try {
      await useCase.updateStockBodega(id, stockBodega)
      await get().fetchStocks()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al actualizar stock'
      set({ error: message, loading: false })
      throw err
    }
  },

  deleteStockBodega: async (id) => {
    set({ loading: true, error: null })
    try {
      await useCase.deleteStockBodega(id)
      await get().fetchStocks()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al eliminar stock'
      set({ error: message, loading: false })
      throw err
    }
  }
}))
