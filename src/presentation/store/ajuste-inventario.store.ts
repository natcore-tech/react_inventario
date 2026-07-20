// src/presentation/store/ajuste-inventario.store.ts
import { create } from 'zustand'
import { ajusteInventarioUseCase } from '@/infrastructure/factories/ajuste-inventario.factory'
import { useProductoStore } from '@/presentation/store/producto.store'
import type { AjusteInventario } from '@/domain/entities/ajuste-inventario.entity'
import type { CreateAjusteInventarioDto } from '@/application/dtos/create-ajuste-inventario.dto'
import type { UpdateAjusteInventarioDto } from '@/application/dtos/update-ajuste-inventario.dto'

interface AjusteInventarioState {
  ajustes: AjusteInventario[]
  isLoading: boolean
  isSaving: boolean
  error: string | null
}

interface AjusteInventarioActions {
  loadAjustes(): Promise<void>
  createAjuste(dto: CreateAjusteInventarioDto): Promise<void>
  updateAjuste(id: number, dto: UpdateAjusteInventarioDto): Promise<void>
  clearError(): void
}

export const useAjusteInventarioStore = create<AjusteInventarioState & AjusteInventarioActions>((set, get) => ({
  ajustes: [],
  isLoading: false,
  isSaving: false,
  error: null,

  async loadAjustes() {
    set({ isLoading: true, error: null })
    try {
      const ajustes = await ajusteInventarioUseCase.getAjustes()
      set({ ajustes, isLoading: false })
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isLoading: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al cargar los ajustes de inventario',
      })
    }
  },

  async createAjuste(dto) {
    set({ isSaving: true, error: null })
    try {
      await ajusteInventarioUseCase.createAjuste(dto)
      set({ isSaving: false })
      await get().loadAjustes()
      // El backend recalculó el stock del producto en create() — refresca
      // productoStore para que cualquier vista de stock quede al día.
      await useProductoStore.getState().loadProductos()
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isSaving: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al registrar el ajuste',
      })
      throw err
    }
  },

  async updateAjuste(id, dto) {
    set({ isSaving: true, error: null })
    try {
      await ajusteInventarioUseCase.updateAjuste(id, dto)
      set({ isSaving: false })
      await get().loadAjustes()
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isSaving: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al actualizar el ajuste',
      })
      throw err
    }
  },

  clearError() {
    set({ error: null })
  },
}))