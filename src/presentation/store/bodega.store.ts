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
}

const useCase = new BodegaUseCase(new AxiosBodegaRepository())

export const useBodegaStore = create<BodegaState>((set) => ({
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
}))
