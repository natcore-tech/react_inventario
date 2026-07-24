import { create } from 'zustand'
import { BodegaUseCase } from '@/application/use-cases/bodega.use-case'
import { AxiosBodegaRepository } from '@/infrastructure/adapters/axios-bodega.repository'
import { localTokenStorage } from '@/infrastructure/storage/local-token-storage'
import type { Bodega } from '@/domain/entities/bodega.entity'

const FALLBACK_BODEGAS: Bodega[] = [
  { id: 1, nombre: 'Bodega Central Matriz', direccion: 'Av. Principal 101', activa: true },
  { id: 2, nombre: 'Sucursal Norte Express', direccion: 'CC Megapolis Local 45', activa: true },
]

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
    if (!localTokenStorage.getAccessToken()) {
      set({ bodegas: FALLBACK_BODEGAS, loading: false, error: null })
      return
    }
    set({ loading: true, error: null })
    try {
      const apiBodegas = await useCase.getBodegas()
      if (Array.isArray(apiBodegas) && apiBodegas.length > 0) {
        set({ bodegas: apiBodegas, loading: false })
      } else {
        set({ bodegas: FALLBACK_BODEGAS, loading: false })
      }
    } catch {
      set({ bodegas: FALLBACK_BODEGAS, loading: false, error: null })
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
