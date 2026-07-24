// src/presentation/store/cart.store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Producto } from '../../domain/entities/producto.entity'
import { audioService } from '../utils/audio.service'
import { hasActiveSessionToken } from '../utils/session-auth'

export interface CartItem {
  producto: Producto
  cantidad: number
  precioUnitario: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  promoCode: string | null
  discountPercent: number
  selectedBodegaId: number | null
  selectedBodegaNombre: string
  taxRate: number // Parametrizable (ej. 0.15 = 15%)
  
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addItem: (producto: Producto, cantidad?: number, maxStockOverride?: number) => boolean
  removeItem: (productoId: number) => void
  updateQuantity: (productoId: number, cantidad: number, maxStockOverride?: number) => void
  clearCart: () => void
  applyPromo: (code: string, percent: number) => void
  removePromo: () => void
  setSelectedBodega: (id: number | null, nombre?: string) => void
  setTaxRate: (rate: number) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      promoCode: null,
      discountPercent: 0,
      selectedBodegaId: null,
      selectedBodegaNombre: 'Bodega Central',
      taxRate: 0.15, // 15% por defecto

      openCart: () => {
        audioService.playWhoosh()
        set({ isOpen: true })
      },

      closeCart: () => set({ isOpen: false }),

      toggleCart: () => {
        audioService.playWhoosh()
        set((state) => ({ isOpen: !state.isOpen }))
      },

      setSelectedBodega: (id, nombre) => {
        audioService.playClick()
        set({
          selectedBodegaId: id,
          selectedBodegaNombre: nombre || (id === null ? 'Bodega Central' : `Sucursal #${id}`),
        })
      },

      setTaxRate: (rate) => set({ taxRate: rate }),

      addItem: (producto, cantidad = 1, maxStockOverride) => {
        const { items } = get()
        let existing: CartItem | undefined
        for (const item of items) {
          if (item.producto.id === producto.id) {
            existing = item
            break
          }
        }
        const currentQty = existing ? existing.cantidad : 0
        const maxStock = maxStockOverride !== undefined ? maxStockOverride : producto.stock

        if (currentQty + cantidad > maxStock) {
          return false
        }

        const priceNum = parseFloat(producto.precio) || 0

        let updated: CartItem[]
        if (existing) {
          updated = items.map((i) =>
            i.producto.id === producto.id
              ? { ...i, cantidad: i.cantidad + cantidad }
              : i
          )
        } else {
          updated = [...items, { producto, cantidad, precioUnitario: priceNum }]
        }

        audioService.playClick()
        set({ items: updated })
        return true
      },

      removeItem: (productoId) => {
        if (!hasActiveSessionToken()) return
        audioService.playClick()
        set((state) => ({
          items: state.items.filter((i) => i.producto.id !== productoId),
        }))
      },

      updateQuantity: (productoId, cantidad, maxStockOverride) => {
        if (!hasActiveSessionToken()) return
        if (cantidad <= 0) {
          get().removeItem(productoId)
          return
        }
        audioService.playClick()
        set((state) => ({
          items: state.items.map((i) => {
            if (i.producto.id === productoId) {
              const maxStock = maxStockOverride !== undefined ? maxStockOverride : i.producto.stock
              const validQty = Math.min(cantidad, maxStock)
              return { ...i, cantidad: validQty }
            }
            return i
          }),
        }))
      },

      clearCart: () => {
        if (!hasActiveSessionToken()) return
        set({ items: [], promoCode: null, discountPercent: 0 })
      },

      applyPromo: (code, percent) => {
        if (!hasActiveSessionToken()) return
        audioService.playClick()
        set({ promoCode: code, discountPercent: percent })
      },

      removePromo: () => {
        if (!hasActiveSessionToken()) return
        set({ promoCode: null, discountPercent: 0 })
      },
    }),
    {
      name: 'nexus_cyber_cart_storage',
      partialize: (state) => ({
        items: state.items,
        promoCode: state.promoCode,
        discountPercent: state.discountPercent,
        selectedBodegaId: state.selectedBodegaId,
        selectedBodegaNombre: state.selectedBodegaNombre,
        taxRate: state.taxRate,
      }),
    }
  )
)

// Selectores derivados
export const useCartSubtotal = () => {
  const items = useCartStore((state) => state.items)
  return items.reduce((sum, i) => sum + i.cantidad * i.precioUnitario, 0)
}

export const useCartTotalCount = () => {
  const items = useCartStore((state) => state.items)
  return items.reduce((sum, i) => sum + i.cantidad, 0)
}
