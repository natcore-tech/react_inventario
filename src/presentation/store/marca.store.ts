// src/presentation/store/marca.store.ts
import { create } from 'zustand'
import { marcaUseCase } from '@/infrastructure/factories/marca.factory'
import type { Marca } from '@/domain/entities/marca.entity'

// ─── Tipos del store ──────────────────────────────────────────────────────────

interface MarcaState {
  /** Lista de marcas cargadas desde el servidor. */
  marcas: Marca[]
  /** true mientras hay una operación de red en curso. */
  isLoading: boolean
  /** Mensaje de error del último intento fallido, null si no hay error. */
  error: string | null
}

interface MarcaActions {
  /** Carga todas las marcas desde el API. */
  fetchMarcas(): Promise<void>
  /** Crea una nueva marca */
  createMarca(data: Omit<Marca, 'id'>): Promise<void>
  /** Actualiza una marca */
  updateMarca(id: number, data: Partial<Marca>): Promise<void>
  /** Elimina una marca */
  deleteMarca(id: number): Promise<void>
  /** Limpia el error actual. */
  clearError(): void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useMarcaStore = create<MarcaState & MarcaActions>((set) => ({
  // ── Estado inicial ──────────────────────────────────────────────────────
  marcas: [],
  isLoading: false,
  error: null,

  // ── Acciones ────────────────────────────────────────────────────────────

  async fetchMarcas() {
    set({ isLoading: true, error: null })
    try {
      const marcas = await marcaUseCase.getMarcas()
      set({ marcas, isLoading: false })
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isLoading: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al cargar las marcas',
      })
    }
  },

  async createMarca(data: Omit<Marca, 'id'>) {
    set({ isLoading: true, error: null })
    try {
      const newMarca = await marcaUseCase.createMarca(data)
      set((state) => ({
        marcas: [...state.marcas, newMarca],
        isLoading: false
      }))
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isLoading: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al crear la marca',
      })
      throw err // Rethrow to handle it in the UI (e.g., closing modal)
    }
  },

  async updateMarca(id: number, data: Partial<Marca>) {
    set({ isLoading: true, error: null })
    try {
      const updatedMarca = await marcaUseCase.updateMarca(id, data)
      set((state) => ({
        marcas: state.marcas.map(m => m.id === id ? updatedMarca : m),
        isLoading: false
      }))
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isLoading: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al actualizar la marca',
      })
      throw err
    }
  },

  async deleteMarca(id: number) {
    set({ isLoading: true, error: null })
    try {
      await marcaUseCase.deleteMarca(id)
      set((state) => ({
        marcas: state.marcas.filter(m => m.id !== id),
        isLoading: false
      }))
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isLoading: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al eliminar la marca',
      })
      throw err
    }
  },

  clearError() {
    set({ error: null })
  },
}))
