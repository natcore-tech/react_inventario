// src/presentation/store/venta.store.ts
import { create } from 'zustand'
import { ventaUseCase } from '@/infrastructure/factories/venta.factory'
import type { Venta } from '@/domain/entities/venta.entity'
import type { CreateVentaDto, UpdateVentaDto } from '@/application/dtos/venta.dto'

interface VentaState {
  ventas: Venta[]
  isLoading: boolean
  isSaving: boolean
  error: string | null
}

interface VentaActions {
  loadVentas(): Promise<void>
  crearVenta(dto: CreateVentaDto): Promise<Venta>
  anularVenta(id: number): Promise<void>
  clearError(): void
}

export const useVentaStore = create<VentaState & VentaActions>((set, get) => ({
  ventas: [],
  isLoading: false,
  isSaving: false,
  error: null,

  async loadVentas() {
    set({ isLoading: true, error: null })
    try {
      const ventas = await ventaUseCase.getVentas()
      set({ ventas, isLoading: false })
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isLoading: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al cargar el historial de ventas',
      })
    }
  },

  async crearVenta(dto) {
    set({ isSaving: true, error: null })
    try {
      const nuevaVenta = await ventaUseCase.crearVenta(dto)
      set({ isSaving: false })
      await get().loadVentas()
      return nuevaVenta
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string; non_field_errors?: string[] }
      let errorMsg = 'Error al procesar la venta'
      if (apiErr.non_field_errors?.length) {
        errorMsg = apiErr.non_field_errors[0]
      } else if (apiErr.detail || apiErr.message) {
        errorMsg = apiErr.detail ?? apiErr.message ?? errorMsg
      }
      set({ isSaving: false, error: errorMsg })
      throw err
    }
  },

  async anularVenta(id) {
    set({ isSaving: true, error: null })
    try {
      await ventaUseCase.updateVenta(id, { estado: 'ANULADA' })
      set({ isSaving: false })
      await get().loadVentas()
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isSaving: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al anular la venta',
      })
      throw err
    }
  },

  clearError() {
    set({ error: null })
  },
}))
