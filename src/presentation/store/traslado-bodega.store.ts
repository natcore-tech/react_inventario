// src/presentation/store/traslado-bodega.store.ts
import { create } from 'zustand'
import { TrasladoBodegaUseCase } from '@/application/use-cases/traslado-bodega.use-case'
import { AxiosTrasladoBodegaRepository } from '@/infrastructure/adapters/axios-traslado-bodega.repository'
import type { TrasladoBodega } from '@/domain/entities/traslado-bodega.entity'

interface TrasladoBodegaState {
  traslados: TrasladoBodega[]
  loading: boolean
  error: string | null
  fetchTraslados: () => Promise<void>
}

const useCase = new TrasladoBodegaUseCase(new AxiosTrasladoBodegaRepository())

export const useTrasladoBodegaStore = create<TrasladoBodegaState>((set) => ({
  traslados: [],
  loading: false,
  error: null,

  fetchTraslados: async () => {
    set({ loading: true, error: null })
    try {
      const traslados = await useCase.getTrasladosBodegas()
      set({ traslados, loading: false })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar traslados'
      set({ error: message, loading: false })
    }
  },
}))
