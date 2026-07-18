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

  clearError() {
    set({ error: null })
  },
}))
