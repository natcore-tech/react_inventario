// src/presentation/store/movimiento-inventario.store.ts
import { create } from 'zustand'
import { movimientoInventarioUseCase } from '@/infrastructure/factories/movimiento-inventario.factory'
import type { MovimientoInventario } from '@/domain/entities/movimiento-inventario.entity'
import type { CreateMovimientoInventarioDto } from '@/application/dtos/movimiento-inventario.dto'

interface MovimientoInventarioState {
  movimientos: MovimientoInventario[]
  isLoading: boolean
  isSaving: boolean
  error: string | null
}

interface MovimientoInventarioActions {
  loadMovimientos(): Promise<void>
  crearMovimiento(dto: CreateMovimientoInventarioDto): Promise<void>
  clearError(): void
}

export const useMovimientoInventarioStore = create<MovimientoInventarioState & MovimientoInventarioActions>((set, get) => ({
  movimientos: [],
  isLoading: false,
  isSaving: false,
  error: null,

  async loadMovimientos() {
    set({ isLoading: true, error: null })
    try {
      const movimientos = await movimientoInventarioUseCase.getMovimientos()
      set({ movimientos, isLoading: false })
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isLoading: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al cargar los movimientos',
      })
    }
  },

  async crearMovimiento(dto) {
    set({ isSaving: true, error: null })
    try {
      await movimientoInventarioUseCase.crearMovimiento(dto)
      set({ isSaving: false })
      await get().loadMovimientos()
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string; non_field_errors?: string[] }
      let errorMsg = 'Error al registrar el movimiento'
      if (apiErr.non_field_errors?.length) {
        errorMsg = apiErr.non_field_errors[0]
      } else if (apiErr.detail || apiErr.message) {
        errorMsg = apiErr.detail ?? apiErr.message ?? errorMsg
      }
      set({ isSaving: false, error: errorMsg })
      throw err
    }
  },

  clearError() {
    set({ error: null })
  },
}))
