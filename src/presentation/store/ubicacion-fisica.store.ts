// src/presentation/store/ubicacion-fisica.store.ts
import { create } from 'zustand'
import { ubicacionFisicaUseCase } from '@/infrastructure/factories/ubicacion-fisica.factory'
import type { UbicacionFisica } from '@/domain/entities/ubicacion-fisica.entity'

// ─── Tipos del store ──────────────────────────────────────────────────────────

interface UbicacionFisicaState {
  /** Lista de ubicaciones físicas cargadas desde el servidor. */
  ubicaciones: UbicacionFisica[]
  /** true mientras hay una operación de red en curso. */
  isLoading: boolean
  /** Mensaje de error del último intento fallido, null si no hay error. */
  error: string | null
}

interface UbicacionFisicaActions {
  /** Carga todas las ubicaciones físicas desde el API. */
  fetchUbicaciones(): Promise<void>
  /** Crea una nueva ubicación física */
  createUbicacion(data: Omit<UbicacionFisica, 'id' | 'coordenada_exacta'>): Promise<void>
  /** Actualiza una ubicación física */
  updateUbicacion(id: number, data: Partial<UbicacionFisica>): Promise<void>
  /** Elimina una ubicación física */
  deleteUbicacion(id: number): Promise<void>
  /** Limpia el error actual. */
  clearError(): void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useUbicacionFisicaStore = create<UbicacionFisicaState & UbicacionFisicaActions>((set) => ({
  // ── Estado inicial ──────────────────────────────────────────────────────
  ubicaciones: [],
  isLoading: false,
  error: null,

  // ── Acciones ────────────────────────────────────────────────────────────

  async fetchUbicaciones() {
    set({ isLoading: true, error: null })
    try {
      const ubicaciones = await ubicacionFisicaUseCase.getUbicaciones()
      set({ ubicaciones, isLoading: false })
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isLoading: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al cargar las ubicaciones físicas',
      })
    }
  },

  async createUbicacion(data: Omit<UbicacionFisica, 'id' | 'coordenada_exacta'>) {
    set({ isLoading: true, error: null })
    try {
      const nuevaUbicacion = await ubicacionFisicaUseCase.createUbicacion(data)
      set((state) => ({
        ubicaciones: [...state.ubicaciones, nuevaUbicacion],
        isLoading: false
      }))
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isLoading: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al crear la ubicación física',
      })
      throw err
    }
  },

  async updateUbicacion(id: number, data: Partial<UbicacionFisica>) {
    set({ isLoading: true, error: null })
    try {
      const updatedUbicacion = await ubicacionFisicaUseCase.updateUbicacion(id, data)
      set((state) => ({
        ubicaciones: state.ubicaciones.map(u => u.id === id ? updatedUbicacion : u),
        isLoading: false
      }))
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isLoading: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al actualizar la ubicación física',
      })
      throw err
    }
  },

  async deleteUbicacion(id: number) {
    set({ isLoading: true, error: null })
    try {
      await ubicacionFisicaUseCase.deleteUbicacion(id)
      set((state) => ({
        ubicaciones: state.ubicaciones.filter(u => u.id !== id),
        isLoading: false
      }))
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isLoading: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al eliminar la ubicación física',
      })
      throw err
    }
  },

  clearError() {
    set({ error: null })
  },
}))
