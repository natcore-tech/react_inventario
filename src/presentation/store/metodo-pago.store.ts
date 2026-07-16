// src/presentation/store/metodo-pago.store.ts
import { create } from 'zustand'
import { metodoPagoUseCase } from '@/infrastructure/factories/metodo-pago.factory'
import type { MetodoPago } from '@/domain/entities/metodo-pago.entity'

// ─── Tipos del store ──────────────────────────────────────────────────────────

interface MetodoPagoState {
  /** Lista de métodos de pago cargados desde la API. */
  metodosPago: MetodoPago[]
  /** true mientras la petición de red está en curso. */
  isLoading: boolean
  /** Mensaje de error del último intento fallido, null si no hay error. */
  error: string | null
}

interface MetodoPagoActions {
  /** GET /metodos-pago/ — carga la lista y la guarda en el estado. */
  loadMetodosPago(): Promise<void>
  /** Limpia el error actual. */
  clearError(): void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useMetodoPagoStore = create<MetodoPagoState & MetodoPagoActions>((set) => ({
  // ── Estado inicial ──────────────────────────────────────────────────────
  metodosPago: [],
  isLoading: false,
  error: null,

  // ── Acciones ────────────────────────────────────────────────────────────

  async loadMetodosPago() {
    set({ isLoading: true, error: null })
    try {
      const metodosPago = await metodoPagoUseCase.getMetodosPago()
      set({ metodosPago, isLoading: false })
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isLoading: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al cargar los métodos de pago',
      })
    }
  },

  clearError() {
    set({ error: null })
  },
}))

// ─── Selectores de conveniencia ───────────────────────────────────────────────

/** Métodos de pago activos solamente. */
export const selectMetodosPagoActivos = (state: MetodoPagoState) =>
  state.metodosPago.filter((m) => m.es_activo)

/** Métodos de pago inactivos solamente. */
export const selectMetodosPagoInactivos = (state: MetodoPagoState) =>
  state.metodosPago.filter((m) => !m.es_activo)
