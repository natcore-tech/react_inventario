// src/presentation/store/metodo-pago.store.ts
import { create } from 'zustand'
import { metodoPagoUseCase } from '@/infrastructure/factories/metodo-pago.factory'
import type { MetodoPago } from '@/domain/entities/metodo-pago.entity'
import type { CreateMetodoPagoDto, UpdateMetodoPagoDto } from '@/application/dtos/metodo-pago.dto'

// ─── Tipos del store ──────────────────────────────────────────────────────────

interface MetodoPagoState {
  /** Lista de métodos de pago cargados desde la API. */
  metodosPago: MetodoPago[]
  /** true mientras GET /metodos-pago/ está en curso. */
  isLoading: boolean
  /** true mientras POST, PATCH o DELETE están en curso. */
  isSaving: boolean
  /** Mensaje de error del último intento fallido, null si no hay error. */
  error: string | null
}

interface MetodoPagoActions {
  /** GET /metodos-pago/ — carga la lista y la guarda en el estado. */
  loadMetodosPago(): Promise<void>
  /** POST /metodos-pago/ — crea un método de pago y recarga la lista. */
  createMetodoPago(dto: CreateMetodoPagoDto): Promise<void>
  /** PATCH /metodos-pago/:id/ — actualiza un método de pago y recarga la lista. */
  updateMetodoPago(id: number, dto: UpdateMetodoPagoDto): Promise<void>
  /** DELETE /metodos-pago/:id/ — elimina (soft delete) y recarga la lista. */
  deleteMetodoPago(id: number): Promise<void>
  /** Limpia el error actual. */
  clearError(): void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useMetodoPagoStore = create<MetodoPagoState & MetodoPagoActions>((set, get) => ({
  // ── Estado inicial ──────────────────────────────────────────────────────
  metodosPago: [],
  isLoading: false,
  isSaving: false,
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

  async createMetodoPago(dto) {
    set({ isSaving: true, error: null })
    try {
      await metodoPagoUseCase.createMetodoPago(dto)
      set({ isSaving: false })
      await get().loadMetodosPago()
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isSaving: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al crear el método de pago',
      })
      throw err
    }
  },

  async updateMetodoPago(id, dto) {
    set({ isSaving: true, error: null })
    try {
      await metodoPagoUseCase.updateMetodoPago(id, dto)
      set({ isSaving: false })
      await get().loadMetodosPago()
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isSaving: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al actualizar el método de pago',
      })
      throw err
    }
  },

  async deleteMetodoPago(id) {
    set({ isSaving: true, error: null })
    try {
      await metodoPagoUseCase.deleteMetodoPago(id)
      set({ isSaving: false })
      await get().loadMetodosPago()
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isSaving: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al eliminar el método de pago',
      })
      throw err
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
