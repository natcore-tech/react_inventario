// src/presentation/store/promocion.store.ts
import { create } from 'zustand'
import { promocionUseCase } from '@/infrastructure/factories/promocion.factory'
import type { Promocion } from '@/domain/entities/promocion.entity'

// ─── Tipos del store ──────────────────────────────────────────────────────────

interface PromocionState {
  /** Lista de promociones cargadas desde la API. */
  promociones: Promocion[]
  /** true mientras la petición de red está en curso. */
  isLoading: boolean
  /** Mensaje de error del último intento fallido, null si no hay error. */
  error: string | null
}

interface PromocionActions {
  /** GET /promociones/ — carga la lista y la guarda en el estado. */
  loadPromociones(): Promise<void>
  /** Limpia el error actual. */
  clearError(): void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const usePromocionStore = create<PromocionState & PromocionActions>((set) => ({
  // ── Estado inicial ──────────────────────────────────────────────────────
  promociones: [],
  isLoading: false,
  error: null,

  // ── Acciones ────────────────────────────────────────────────────────────

  async loadPromociones() {
    set({ isLoading: true, error: null })
    try {
      const promociones = await promocionUseCase.getPromociones()
      set({ promociones, isLoading: false })
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isLoading: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al cargar las promociones',
      })
    }
  },

  clearError() {
    set({ error: null })
  },
}))

// ─── Selectores de conveniencia ───────────────────────────────────────────────

/** Promociones activas solamente. */
export const selectPromocionesActivas = (state: PromocionState) =>
  state.promociones.filter((p) => p.es_activa)

/** Promociones inactivas solamente. */
export const selectPromocionesInactivas = (state: PromocionState) =>
  state.promociones.filter((p) => !p.es_activa)

/** Promociones vigentes hoy (fecha_inicio <= hoy <= fecha_fin). */
export const selectPromocionesVigentes = (state: PromocionState) => {
  const hoy = new Date().toISOString().slice(0, 10)
  return state.promociones.filter(
    (p) => p.es_activa && p.fecha_inicio <= hoy && p.fecha_fin >= hoy,
  )
}
