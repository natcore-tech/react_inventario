// src/presentation/store/devolucion-cliente.store.ts
import { create } from 'zustand'
import { devolucionClienteUseCase } from '@/infrastructure/factories/devolucion-cliente.factory'
import { useProductoStore } from '@/presentation/store/producto.store'
import type { DevolucionCliente } from '@/domain/entities/devolucion-cliente.entity'
import type { CreateDevolucionClienteDto } from '@/application/dtos/create-devolucion-cliente.dto'
import type { UpdateDevolucionClienteDto } from '@/application/dtos/update-devolucion-cliente.dto'

interface DevolucionClienteState {
  devoluciones: DevolucionCliente[]
  isLoading: boolean
  isSaving: boolean
  error: string | null
}

interface DevolucionClienteActions {
  loadDevoluciones(): Promise<void>
  createDevolucion(dto: CreateDevolucionClienteDto): Promise<void>
  updateDevolucion(id: number, dto: UpdateDevolucionClienteDto): Promise<void>
  clearError(): void
}

export const useDevolucionClienteStore = create<DevolucionClienteState & DevolucionClienteActions>((set, get) => ({
  devoluciones: [],
  isLoading: false,
  isSaving: false,
  error: null,

  async loadDevoluciones() {
    set({ isLoading: true, error: null })
    try {
      const devoluciones = await devolucionClienteUseCase.getDevoluciones()
      set({ devoluciones, isLoading: false })
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({ isLoading: false, error: apiErr.detail ?? apiErr.message ?? 'Error al cargar las devoluciones' })
    }
  },

  async createDevolucion(dto) {
    set({ isSaving: true, error: null })
    try {
      await devolucionClienteUseCase.createDevolucion(dto)
      set({ isSaving: false })
      await get().loadDevoluciones()
      // Si estado_producto fue 'BUENO', el backend reingresó cantidad al
      // stock del producto al crear — refresca productoStore para reflejarlo.
      await useProductoStore.getState().loadProductos()
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({ isSaving: false, error: apiErr.detail ?? apiErr.message ?? 'Error al registrar la devolución' })
      throw err
    }
  },

  async updateDevolucion(id, dto) {
    set({ isSaving: true, error: null })
    try {
      await devolucionClienteUseCase.updateDevolucion(id, dto)
      set({ isSaving: false })
      await get().loadDevoluciones()
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({ isSaving: false, error: apiErr.detail ?? apiErr.message ?? 'Error al actualizar la devolución' })
      throw err
    }
  },

  clearError() {
    set({ error: null })
  },
}))