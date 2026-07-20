// src/presentation/store/alerta-stock-minimo.store.ts
import { create } from 'zustand'
import { alertaStockMinimoUseCase } from '@/infrastructure/factories/alerta-stock-minimo.factory'
import type { AlertaStockMinimo } from '@/domain/entities/alerta-stock-minimo.entity'
import type { CreateAlertaStockMinimoDto } from '@/application/dtos/create-alerta-stock-minimo.dto'
import type { UpdateAlertaStockMinimoDto } from '@/application/dtos/update-alerta-stock-minimo.dto'

interface AlertaStockMinimoState {
  alertas: AlertaStockMinimo[]
  isLoading: boolean
  isSaving: boolean
  error: string | null
}

interface AlertaStockMinimoActions {
  loadAlertas(): Promise<void>
  createAlerta(dto: CreateAlertaStockMinimoDto): Promise<void>
  updateAlerta(id: number, dto: UpdateAlertaStockMinimoDto): Promise<void>
  deleteAlerta(id: number): Promise<void>
  clearError(): void
}

export const useAlertaStockMinimoStore = create<AlertaStockMinimoState & AlertaStockMinimoActions>((set, get) => ({
  alertas: [],
  isLoading: false,
  isSaving: false,
  error: null,

  async loadAlertas() {
    set({ isLoading: true, error: null })
    try {
      const alertas = await alertaStockMinimoUseCase.getAlertas()
      set({ alertas, isLoading: false })
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({ isLoading: false, error: apiErr.detail ?? apiErr.message ?? 'Error al cargar las alertas de stock' })
    }
  },

  async createAlerta(dto) {
    set({ isSaving: true, error: null })
    try {
      await alertaStockMinimoUseCase.createAlerta(dto)
      set({ isSaving: false })
      await get().loadAlertas()
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({ isSaving: false, error: apiErr.detail ?? apiErr.message ?? 'Error al registrar la alerta' })
      throw err
    }
  },

  async updateAlerta(id, dto) {
    set({ isSaving: true, error: null })
    try {
      await alertaStockMinimoUseCase.updateAlerta(id, dto)
      set({ isSaving: false })
      await get().loadAlertas()
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({ isSaving: false, error: apiErr.detail ?? apiErr.message ?? 'Error al actualizar la alerta' })
      throw err
    }
  },

  async deleteAlerta(id) {
    set({ isSaving: true, error: null })
    try {
      await alertaStockMinimoUseCase.deleteAlerta(id)
      set({ isSaving: false })
      await get().loadAlertas()
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({ isSaving: false, error: apiErr.detail ?? apiErr.message ?? 'Error al eliminar la alerta' })
      throw err
    }
  },

  clearError() {
    set({ error: null })
  },
}))