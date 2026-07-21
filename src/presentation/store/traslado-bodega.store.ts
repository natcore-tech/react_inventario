// src/presentation/store/traslado-bodega.store.ts
import { create } from 'zustand'
import { TrasladoBodegaUseCase } from '@/application/use-cases/traslado-bodega.use-case'
import { AxiosTrasladoBodegaRepository } from '@/infrastructure/adapters/axios-traslado-bodega.repository'
import { TrasladoBodegaDetalleUseCase } from '@/application/use-cases/traslado-bodega-detalle.use-case'
import { AxiosTrasladoBodegaDetalleRepository } from '@/infrastructure/adapters/axios-traslado-bodega-detalle.repository'
import type { TrasladoBodega, TrasladoBodegaDetalle } from '@/domain/entities/traslado-bodega.entity'

interface TrasladoBodegaState {
  traslados: TrasladoBodega[]
  loading: boolean
  error: string | null
  fetchTraslados: () => Promise<void>
  createTrasladoBodega: (traslado: Omit<TrasladoBodega, 'id' | 'fecha_traslado' | 'bodega_origen_nombre' | 'bodega_destino_nombre'>) => Promise<void>
  updateTrasladoBodega: (id: number, traslado: Partial<Omit<TrasladoBodega, 'id' | 'fecha_traslado' | 'bodega_origen_nombre' | 'bodega_destino_nombre'>>) => Promise<void>
  deleteTrasladoBodega: (id: number) => Promise<void>
  createTrasladoBodegaDetalle: (trasladoId: number, detalle: Omit<TrasladoBodegaDetalle, 'id' | 'traslado'>) => Promise<void>
  updateTrasladoBodegaDetalle: (trasladoId: number, detalleId: number, detalle: Partial<Omit<TrasladoBodegaDetalle, 'id' | 'traslado'>>) => Promise<void>
  deleteTrasladoBodegaDetalle: (trasladoId: number, detalleId: number) => Promise<void>
}

const useCase = new TrasladoBodegaUseCase(new AxiosTrasladoBodegaRepository())
const useCaseDetalle = new TrasladoBodegaDetalleUseCase(new AxiosTrasladoBodegaDetalleRepository())

export const useTrasladoBodegaStore = create<TrasladoBodegaState>((set, get) => ({
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

  createTrasladoBodega: async (traslado) => {
    set({ loading: true, error: null })
    try {
      await useCase.createTrasladoBodega(traslado)
      await get().fetchTraslados()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear traslado'
      set({ error: message, loading: false })
      throw err
    }
  },

  updateTrasladoBodega: async (id, traslado) => {
    set({ loading: true, error: null })
    try {
      await useCase.updateTrasladoBodega(id, traslado)
      await get().fetchTraslados()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al actualizar traslado'
      set({ error: message, loading: false })
      throw err
    }
  },

  deleteTrasladoBodega: async (id) => {
    set({ loading: true, error: null })
    try {
      await useCase.deleteTrasladoBodega(id)
      await get().fetchTraslados()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al eliminar traslado'
      set({ error: message, loading: false })
      throw err
    }
  },

  createTrasladoBodegaDetalle: async (trasladoId, detalle) => {
    set({ loading: true, error: null })
    try {
      await useCaseDetalle.createTrasladoBodegaDetalle(trasladoId, detalle)
      await get().fetchTraslados()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear detalle'
      set({ error: message, loading: false })
      throw err
    }
  },

  updateTrasladoBodegaDetalle: async (trasladoId, detalleId, detalle) => {
    set({ loading: true, error: null })
    try {
      await useCaseDetalle.updateTrasladoBodegaDetalle(trasladoId, detalleId, detalle)
      await get().fetchTraslados()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al actualizar detalle'
      set({ error: message, loading: false })
      throw err
    }
  },

  deleteTrasladoBodegaDetalle: async (trasladoId, detalleId) => {
    set({ loading: true, error: null })
    try {
      await useCaseDetalle.deleteTrasladoBodegaDetalle(trasladoId, detalleId)
      await get().fetchTraslados()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al eliminar detalle'
      set({ error: message, loading: false })
      throw err
    }
  }
}))
