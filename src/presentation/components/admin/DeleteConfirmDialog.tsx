// src/presentation/store/compras.store.ts

import { create } from 'zustand'
import { proveedorUseCase } from '@/infrastructure/factories/proveedor.factory'
import { ApiException } from '@/domain/exceptions/api.exception'
import type { Proveedor } from '@/domain/entities/proveedor.entity'
import type { CreateProveedorDto } from '@/application/dtos/create-proveedor.dto'
import type { UpdateProveedorDto } from '@/application/dtos/update-proveedor.dto'

interface ComprasState {
  // ── Slice: Proveedores ──────────────────────────────────────────────────
  proveedores: Proveedor[]
  isLoadingProveedores: boolean
  proveedoresError: string | null

}

interface ComprasActions {
  // ── Slice: Proveedores ──────────────────────────────────────────────────
  fetchProveedores(): Promise<void>
  createProveedor(dto: CreateProveedorDto): Promise<void>
  updateProveedor(id: number, dto: UpdateProveedorDto): Promise<void>
  deleteProveedor(id: number): Promise<void>
}

export const useComprasStore = create<ComprasState & ComprasActions>((set, get) => ({
  proveedores: [],
  isLoadingProveedores: false,
  proveedoresError: null,

  async fetchProveedores() {
    set({ isLoadingProveedores: true, proveedoresError: null })
    try {
      const proveedores = await proveedorUseCase.getProveedores()
      set({ proveedores })
    } catch {
      set({ proveedoresError: 'No se pudieron cargar los proveedores.' })
    } finally {
      set({ isLoadingProveedores: false })
    }
  },

  async createProveedor(dto) {
    try {
      const proveedor = await proveedorUseCase.createProveedor(dto)
      set({ proveedores: [proveedor, ...get().proveedores] })
    } catch (err) {
      throw err instanceof ApiException ? err : new Error('No se pudo crear el proveedor.')
    }
  },

  async updateProveedor(id, dto) {
    try {
      const actualizado = await proveedorUseCase.updateProveedor(id, dto)
      set({ proveedores: get().proveedores.map((p) => (p.id === id ? actualizado : p)) })
    } catch (err) {
      throw err instanceof ApiException ? err : new Error('No se pudo actualizar el proveedor.')
    }
  },

  async deleteProveedor(id) {
    try {
      await proveedorUseCase.deleteProveedor(id)
      set({ proveedores: get().proveedores.filter((p) => p.id !== id) })
    } catch (err) {
      throw err instanceof ApiException ? err : new Error('No se pudo eliminar el proveedor.')
    }
  },
}))