// src/presentation/store/pos.store.ts
import { create } from 'zustand'
import type { Producto } from '@/domain/entities/producto.entity'

export interface CartItem {
  producto: Producto
  cantidad: number
  subtotal_estimado: number // Calculado en frontend solo como referencia
}

interface PosState {
  clienteId: number | null
  cartItems: CartItem[]
}

interface PosActions {
  setCliente: (id: number | null) => void
  addItem: (producto: Producto) => void
  removeItem: (productoId: number) => void
  updateQuantity: (productoId: number, cantidad: number) => void
  clearCart: () => void
}

export const usePosStore = create<PosState & PosActions>((set) => ({
  clienteId: null,
  cartItems: [],

  setCliente: (id) => set({ clienteId: id }),

  addItem: (producto) => set((state) => {
    const existing = state.cartItems.find((i) => i.producto.id === producto.id)
    if (existing) {
      if (existing.cantidad + 1 > producto.stock) return state // Previene sobrepasar stock base
      
      const updated = state.cartItems.map((i) =>
        i.producto.id === producto.id
          ? {
              ...i,
              cantidad: i.cantidad + 1,
              subtotal_estimado: (i.cantidad + 1) * parseFloat(producto.precio)
            }
          : i
      )
      return { cartItems: updated }
    }

    if (producto.stock < 1) return state

    return {
      cartItems: [
        ...state.cartItems,
        {
          producto,
          cantidad: 1,
          subtotal_estimado: parseFloat(producto.precio)
        }
      ]
    }
  }),

  removeItem: (productoId) => set((state) => ({
    cartItems: state.cartItems.filter((i) => i.producto.id !== productoId)
  })),

  updateQuantity: (productoId, cantidad) => set((state) => {
    if (cantidad <= 0) {
      return { cartItems: state.cartItems.filter((i) => i.producto.id !== productoId) }
    }

    return {
      cartItems: state.cartItems.map((i) => {
        if (i.producto.id === productoId) {
          // Previene exceder stock base
          const validQty = Math.min(cantidad, i.producto.stock)
          return {
            ...i,
            cantidad: validQty,
            subtotal_estimado: validQty * parseFloat(i.producto.precio)
          }
        }
        return i
      })
    }
  }),

  clearCart: () => set({ cartItems: [], clienteId: null })
}))

// Selector derivado para estimar el total en el POS
export const usePosTotalEstimado = () => {
  const items = usePosStore((state) => state.cartItems)
  const subtotal = items.reduce((sum, i) => sum + i.subtotal_estimado, 0)
  const iva = subtotal * 0.15 // IVA 15% (estimado, el real lo calcula backend)
  return subtotal + iva
}
