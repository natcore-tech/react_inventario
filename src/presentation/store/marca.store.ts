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

  clearError() {
    set({ error: null })
  },
}))
