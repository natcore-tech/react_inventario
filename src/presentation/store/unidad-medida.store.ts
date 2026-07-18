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

  clearError() {
    set({ error: null })
  },
}))
