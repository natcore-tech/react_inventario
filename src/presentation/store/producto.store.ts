import { create } from 'zustand'
import { productoUseCase } from '@/infrastructure/factories/producto.factory'
import type { Producto } from '@/domain/entities/producto.entity'
import type { CreateProductoDto, UpdateProductoDto } from '@/application/dtos/producto.dto'


interface ProductoState {
  productos: Producto[]
  isLoading: boolean
  isSaving: boolean
  error: string | null
}

interface ProductoActions {
  loadProductos(): Promise<void>
  createProducto(dto: CreateProductoDto): Promise<void>
  updateProducto(id: number, dto: UpdateProductoDto): Promise<void>
  deleteProducto(id: number): Promise<void>
  clearError(): void
}

export const useProductoStore = create<ProductoState & ProductoActions>((set, get) => ({
  productos: [],
  isLoading: false,
  isSaving: false,
  error: null,

  async loadProductos() {
    if (get().isLoading && get().productos.length > 0) return
    set({ isLoading: true, error: null })
    try {
      const apiProductos = await productoUseCase.getProductos()
      const list = Array.isArray(apiProductos) ? apiProductos : []
      set({ productos: list, isLoading: false })
    } catch (err: any) {
      set({ isLoading: false, error: err?.message || 'Error loading productos' })
    }
  },

  async createProducto(dto) {
    set({ isSaving: true, error: null })
    try {
      await productoUseCase.createProducto(dto)
      set({ isSaving: false })
      await get().loadProductos()
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isSaving: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al crear el producto',
      })
      throw err
    }
  },

  async updateProducto(id, dto) {
    set({ isSaving: true, error: null })
    try {
      await productoUseCase.updateProducto(id, dto)
      set({ isSaving: false })
      await get().loadProductos()
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isSaving: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al actualizar el producto',
      })
      throw err
    }
  },

  async deleteProducto(id) {
    set({ isSaving: true, error: null })
    try {
      await productoUseCase.deleteProducto(id)
      set({ isSaving: false })
      await get().loadProductos()
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isSaving: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al eliminar el producto',
      })
      throw err
    }
  },

  clearError() {
    set({ error: null })
  },
}))

export const selectProductosActivos = (state: ProductoState) =>
  state.productos.filter((p) => p.es_activo)

export const selectProductosSinStock = (state: ProductoState) =>
  state.productos.filter((p) => !p.en_stock)
