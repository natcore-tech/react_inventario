// src/presentation/store/promocion.store.ts
import { create } from 'zustand'
import { promocionUseCase } from '@/infrastructure/factories/promocion.factory'
import type { Promocion } from '@/domain/entities/promocion.entity'
import type { CreatePromocionDto, UpdatePromocionDto } from '@/application/dtos/promocion.dto'

// ─── Tipos del store ──────────────────────────────────────────────────────────

interface PromocionState {
  /** Lista de promociones cargadas desde la API. */
  promociones: Promocion[]
  /** true mientras GET /promociones/ está en curso. */
  isLoading: boolean
  /** true mientras POST, PATCH o DELETE están en curso. */
  isSaving: boolean
  /** Mensaje de error del último intento fallido, null si no hay error. */
  error: string | null
}

interface PromocionActions {
  /** GET /promociones/ — carga la lista y la guarda en el estado. */
  loadPromociones(): Promise<void>
  /** POST /promociones/ — crea una promoción y recarga la lista. */
  createPromocion(dto: CreatePromocionDto): Promise<void>
  /** PATCH /promociones/:id/ — actualiza una promoción y recarga la lista. */
  updatePromocion(id: number, dto: UpdatePromocionDto): Promise<void>
  /** DELETE /promociones/:id/ — elimina y recarga la lista. */
  deletePromocion(id: number): Promise<void>
  /** Limpia el error actual. */
  clearError(): void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const usePromocionStore = create<PromocionState & PromocionActions>((set, get) => ({
  // ── Estado inicial ──────────────────────────────────────────────────────
  promociones: [],
  isLoading: false,
  isSaving: false,
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

  async createPromocion(dto) {
    set({ isSaving: true, error: null })
    try {
      await promocionUseCase.createPromocion(dto)
      set({ isSaving: false })
      await get().loadPromociones()
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isSaving: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al crear la promoción',
      })
      throw err
    }
  },

  async updatePromocion(id, dto) {
    set({ isSaving: true, error: null })
    try {
      await promocionUseCase.updatePromocion(id, dto)
      set({ isSaving: false })
      await get().loadPromociones()
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isSaving: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al actualizar la promoción',
      })
      throw err
    }
  },

  async deletePromocion(id) {
    set({ isSaving: true, error: null })
    try {
      await promocionUseCase.deletePromocion(id)
      set({ isSaving: false })
      await get().loadPromociones()
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isSaving: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al eliminar la promoción',
      })
      throw err
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
