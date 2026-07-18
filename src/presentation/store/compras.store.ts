// src/presentation/store/compras.store.ts


import { create } from 'zustand'
import { proveedorUseCase } from '../../infrastructure/factories/proveedor.factory'
import { ordenCompraUseCase } from '../../infrastructure/factories/orden-compra.factory'
import { ApiException } from '../../domain/exceptions/api.exception'
import type { Proveedor } from '../../domain/entities/proveedor.entity'
import type { CreateProveedorDto } from '../../application/dtos/create-proveedor.dto'
import type { UpdateProveedorDto } from '../../application/dtos/update-proveedor.dto'
import type { OrdenCompra, EstadoOrdenCompra } from '../../domain/entities/orden-compra.entity'
import type { CreateOrdenCompraDto } from '../../application/dtos/create-orden-compra.dto'

interface ComprasState {
  // ── Slice: Proveedores ──────────────────────────────────────────────────
  proveedores: Proveedor[]
  isLoadingProveedores: boolean
  proveedoresError: string | null

  // ── Slice: Ordenes de Compra ─────────────────────────────────────────────
  ordenesCompra: OrdenCompra[]
  isLoadingOrdenesCompra: boolean
  ordenesCompraError: string | null
}

interface ComprasActions {
  // ── Slice: Proveedores ──────────────────────────────────────────────────
  fetchProveedores(): Promise<void>
  createProveedor(dto: CreateProveedorDto): Promise<void>
  updateProveedor(id: number, dto: UpdateProveedorDto): Promise<void>
  deleteProveedor(id: number): Promise<void>

  // ── Slice: Ordenes de Compra ─────────────────────────────────────────────
  fetchOrdenesCompra(): Promise<void>
  createOrdenCompra(dto: CreateOrdenCompraDto): Promise<void>
  cambiarEstadoOrdenCompra(id: number, estado: EstadoOrdenCompra): Promise<void>
}

export const useComprasStore = create<ComprasState & ComprasActions>((set, get) => ({
  proveedores: [],
  isLoadingProveedores: false,
  proveedoresError: null,

  ordenesCompra: [],
  isLoadingOrdenesCompra: false,
  ordenesCompraError: null,

  // ── Proveedores ────────────────────────────────────────────────────────

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

  // ── Ordenes de Compra ──────────────────────────────────────────────────

  async fetchOrdenesCompra() {
    set({ isLoadingOrdenesCompra: true, ordenesCompraError: null })
    try {
      const ordenesCompra = await ordenCompraUseCase.getOrdenesCompra()
      set({ ordenesCompra })
    } catch {
      set({ ordenesCompraError: 'No se pudieron cargar las ordenes de compra.' })
    } finally {
      set({ isLoadingOrdenesCompra: false })
    }
  },

  async createOrdenCompra(dto) {
    try {
      const orden = await ordenCompraUseCase.createOrdenCompra(dto)
      set({ ordenesCompra: [orden, ...get().ordenesCompra] })
    } catch (err) {
      throw err instanceof ApiException ? err : new Error('No se pudo crear la orden de compra.')
    }
  },

  async cambiarEstadoOrdenCompra(id, estado) {
    try {
      const actualizada =
        estado === 'RECIBIDA'
          ? await ordenCompraUseCase.marcarComoRecibida(id)
          : await ordenCompraUseCase.cancelarOrden(id)
      set({ ordenesCompra: get().ordenesCompra.map((o) => (o.id === id ? actualizada : o)) })
    } catch (err) {
      throw err instanceof ApiException ? err : new Error('No se pudo cambiar el estado de la orden.')
    }
  },
}))