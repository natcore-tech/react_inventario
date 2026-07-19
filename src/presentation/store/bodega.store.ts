// src/presentation/store/bodega.store.ts
import { create } from 'zustand'
import { BodegaUseCase } from '@/application/use-cases/bodega.use-case'
import { AxiosBodegaRepository } from '@/infrastructure/adapters/axios-bodega.repository'
import type { Bodega } from '@/domain/entities/bodega.entity'

interface BodegaState {
  bodegas: Bodega[]
  loading: boolean
  error: string | null
  fetchBodegas: () => Promise<void>
  createBodega: (bodega: Omit<Bodega, 'id'>) => Promise<void>
  updateBodega: (id: number, bodega: Partial<Bodega>) => Promise<void>
  deleteBodega: (id: number) => Promise<void>
}

const useCase = new BodegaUseCase(new AxiosBodegaRepository())

export const useBodegaStore = create<BodegaState>((set, get) => ({
  bodegas: [],
  loading: false,
  error: null,

  fetchBodegas: async () => {
    set({ loading: true, error: null })
    try {
      const bodegas = await useCase.getBodegas()
      set({ bodegas, loading: false })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar bodegas'
      set({ error: message, loading: false })
    }
  },

  createBodega: async (bodega) => {
    set({ loading: true, error: null })
    try {
      await useCase.createBodega(bodega)
      await get().fetchBodegas()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear bodega'
      set({ error: message, loading: false })
      throw err
    }
  },

  updateBodega: async (id, bodega) => {
    set({ loading: true, error: null })
    try {
      await useCase.updateBodega(id, bodega)
      await get().fetchBodegas()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al actualizar bodega'
      set({ error: message, loading: false })
      throw err
    }
  },

  deleteBodega: async (id) => {
    set({ loading: true, error: null })
    try {
      await useCase.deleteBodega(id)
      await get().fetchBodegas()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al eliminar bodega'
      set({ error: message, loading: false })
      throw err
    }
  }
}))
