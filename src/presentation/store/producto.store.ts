// src/presentation/store/producto.store.ts
import { create } from 'zustand'
import { productoUseCase } from '@/infrastructure/factories/producto.factory'
import type { Producto } from '@/domain/entities/producto.entity'

// ─── Tipos del store ──────────────────────────────────────────────────────────

interface ProductoState {
  /** Lista de productos cargados desde la API. */
  productos: Producto[]
  /** true mientras la petición de red está en curso. */
  isLoading: boolean
  /** Mensaje de error del último intento fallido, null si no hay error. */
  error: string | null
}

interface ProductoActions {
  /** GET /productos/ — carga la lista y la guarda en el estado. */
  loadProductos(): Promise<void>
  /** Limpia el error actual. */
  clearError(): void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useProductoStore = create<ProductoState & ProductoActions>((set) => ({
  // ── Estado inicial ──────────────────────────────────────────────────────
  productos: [],
  isLoading: false,
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
