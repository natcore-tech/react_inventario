// src/presentation/store/unidad-medida.store.ts
import { create } from 'zustand'
import { unidadMedidaUseCase } from '@/infrastructure/factories/unidad-medida.factory'
import type { UnidadMedida } from '@/domain/entities/unidad-medida.entity'

// ─── Tipos del store ──────────────────────────────────────────────────────────

interface UnidadMedidaState {
  /** Lista de unidades de medida cargadas desde el servidor. */
  unidades: UnidadMedida[]
  /** true mientras hay una operación de red en curso. */
  isLoading: boolean
  /** Mensaje de error del último intento fallido, null si no hay error. */
  error: string | null
}

interface UnidadMedidaActions {
  /** Carga todas las unidades de medida desde el API. */
  fetchUnidades(): Promise<void>
  /** Crea una nueva unidad de medida */
  createUnidad(data: Omit<UnidadMedida, 'id' | 'descripcion_completa'>): Promise<void>
  /** Actualiza una unidad de medida */
  updateUnidad(id: number, data: Partial<UnidadMedida>): Promise<void>
  /** Elimina una unidad de medida */
  deleteUnidad(id: number): Promise<void>
  /** Limpia el error actual. */
  clearError(): void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useUnidadMedidaStore = create<UnidadMedidaState & UnidadMedidaActions>((set) => ({
  // ── Estado inicial ──────────────────────────────────────────────────────
  unidades: [],
  isLoading: false,
  error: null,

  // ── Acciones ────────────────────────────────────────────────────────────

  async fetchUnidades() {
    set({ isLoading: true, error: null })
    try {
      const unidades = await unidadMedidaUseCase.getUnidadesMedida()
      set({ unidades, isLoading: false })
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isLoading: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al cargar las unidades de medida',
      })
    }
  },

  async createUnidad(data: Omit<UnidadMedida, 'id' | 'descripcion_completa'>) {
    set({ isLoading: true, error: null })
    try {
      const nuevaUnidad = await unidadMedidaUseCase.createUnidadMedida(data)
      set((state) => ({
        unidades: [...state.unidades, nuevaUnidad],
        isLoading: false
      }))
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isLoading: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al crear la unidad de medida',
      })
      throw err
    }
  },

  async updateUnidad(id: number, data: Partial<UnidadMedida>) {
    set({ isLoading: true, error: null })
    try {
      const updatedUnidad = await unidadMedidaUseCase.updateUnidadMedida(id, data)
      set((state) => ({
        unidades: state.unidades.map(u => u.id === id ? updatedUnidad : u),
        isLoading: false
      }))
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isLoading: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al actualizar la unidad de medida',
      })
      throw err
    }
  },

  async deleteUnidad(id: number) {
    set({ isLoading: true, error: null })
    try {
      await unidadMedidaUseCase.deleteUnidadMedida(id)
      set((state) => ({
        unidades: state.unidades.filter(u => u.id !== id),
        isLoading: false
      }))
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isLoading: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al eliminar la unidad de medida',
      })
      throw err
    }
  },

  clearError() {
    set({ error: null })
  },
}))
