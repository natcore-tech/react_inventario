// src/presentation/store/producto.store.ts
import { create } from 'zustand'
import { productoUseCase } from '@/infrastructure/factories/producto.factory'
import type { Producto } from '@/domain/entities/producto.entity'
import type { CreateProductoDto, UpdateProductoDto } from '@/application/dtos/producto.dto'

// ─── Tipos del store ──────────────────────────────────────────────────────────

interface ProductoState {
  /** Lista de productos cargados desde la API. */
  productos: Producto[]
  /** true mientras GET /productos/ está en curso. */
  isLoading: boolean
  /** true mientras POST, PATCH o DELETE están en curso. */
  isSaving: boolean
  /** Mensaje de error del último intento fallido, null si no hay error. */
  error: string | null
}

interface ProductoActions {
  /** GET /productos/ — carga la lista y la guarda en el estado. */
  loadProductos(): Promise<void>
  /** POST /productos/ — crea un producto y recarga la lista. */
  createProducto(dto: CreateProductoDto): Promise<void>
  /** PATCH /productos/:id/ — actualiza un producto y recarga la lista. */
  updateProducto(id: number, dto: UpdateProductoDto): Promise<void>
  /** DELETE /productos/:id/ — elimina (soft delete) y recarga la lista. */
  deleteProducto(id: number): Promise<void>
  /** Limpia el error actual. */
  clearError(): void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useProductoStore = create<ProductoState & ProductoActions>((set, get) => ({
  // ── Estado inicial ──────────────────────────────────────────────────────
  productos: [],
  isLoading: false,
  isSaving: false,
  error: null,

  // ── Acciones ────────────────────────────────────────────────────────────

  async loadProductos() {
    set({ isLoading: true, error: null })
    try {
      const productos = await productoUseCase.getProductos()
      set({ productos, isLoading: false })
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isLoading: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al cargar los productos',
      })
    }
  },

  async createProducto(dto) {
    set({ isSaving: true, error: null })
    try {
      await productoUseCase.createProducto(dto)
      set({ isSaving: false })
      // Recargar la lista para reflejar el nuevo producto
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
      // Recargar la lista para reflejar los cambios
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
      // Recargar la lista para reflejar la eliminación
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

// ─── Selectores de conveniencia ───────────────────────────────────────────────

/** Productos activos solamente. */
export const selectProductosActivos = (state: ProductoState) =>
  state.productos.filter((p) => p.es_activo)

/** Productos sin stock. */
export const selectProductosSinStock = (state: ProductoState) =>
  state.productos.filter((p) => !p.en_stock)
