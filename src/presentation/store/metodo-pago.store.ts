// src/presentation/store/metodo-pago.store.ts
import { create } from 'zustand'
import { metodoPagoUseCase } from '@/infrastructure/factories/metodo-pago.factory'
import type { MetodoPago } from '@/domain/entities/metodo-pago.entity'
import type { CreateMetodoPagoDto, UpdateMetodoPagoDto } from '@/application/dtos/metodo-pago.dto'

const FALLBACK_METODOS: MetodoPago[] = [
  { id: 1, nombre: 'Tarjeta de Crédito / Débito', es_activo: true, creado_en: '', actualizado_en: '' },
  { id: 2, nombre: 'Transferencia Bancaria Directa', es_activo: true, creado_en: '', actualizado_en: '' },
  { id: 3, nombre: 'Billetera Digital / Efectivo', es_activo: true, creado_en: '', actualizado_en: '' },
]

interface MetodoPagoState {
  metodosPago: MetodoPago[]
  isLoading: boolean
  isSaving: boolean
  error: string | null
}

interface MetodoPagoActions {
  loadMetodosPago(): Promise<void>
  createMetodoPago(dto: CreateMetodoPagoDto): Promise<void>
  updateMetodoPago(id: number, dto: UpdateMetodoPagoDto): Promise<void>
  deleteMetodoPago(id: number): Promise<void>
  clearError(): void
}

export const useMetodoPagoStore = create<MetodoPagoState & MetodoPagoActions>((set, get) => ({
  metodosPago: [],
  isLoading: false,
  isSaving: false,
  error: null,

  async loadMetodosPago() {
    set({ isLoading: true, error: null })
    try {
      const apiMetodos = await metodoPagoUseCase.getMetodosPago()
      if (Array.isArray(apiMetodos) && apiMetodos.length > 0) {
        set({ metodosPago: apiMetodos, isLoading: false })
      } else {
        set({ metodosPago: FALLBACK_METODOS, isLoading: false })
      }
    } catch {
      // Silently fall back to sample payment methods on 401 or network error
      set({ metodosPago: FALLBACK_METODOS, isLoading: false, error: null })
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

export const selectMetodosPagoActivos = (state: MetodoPagoState) =>
  state.metodosPago.filter((m) => m.es_activo)
