// src/presentation/components/public/ProductDetailModal.tsx
import { useState } from 'react'

import type { Producto } from '@/domain/entities/producto.entity'
import { useCartStore } from '@/presentation/store/cart.store'

import {
  X, ShoppingBag, ShieldCheck, CheckCircle2, Building
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'

interface ProductDetailModalProps {
  producto: Producto | null
  onClose: () => void
}

export default function ProductDetailModal({ producto, onClose }: ProductDetailModalProps) {

  const addItem = useCartStore((state) => state.addItem)
  const taxRate = useCartStore((state) => state.taxRate)
  const selectedBodegaNombre = useCartStore((state) => state.selectedBodegaNombre)

  const [cantidad, setCantidad] = useState(1)
  const [addedNotice, setAddedNotice] = useState(false)

  if (!producto) return null

  const precioNum = parseFloat(producto.precio) || 0
  const subtotalEst = precioNum * cantidad
  const taxEst = subtotalEst * taxRate
  const totalEst = subtotalEst + taxEst

  const defaultImage = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop'
  const imageUrl = producto.image_url || defaultImage

  const handleAddToCart = () => {
    const success = addItem(producto, cantidad)
    if (success) {
      setAddedNotice(true)
      setTimeout(() => setAddedNotice(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl glass-cyber-card border-neon-purple-strong p-6 md:p-8 shadow-2xl shadow-purple-950/80 text-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 hover:text-white hover:border-purple-400 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Contenido Visual / Galería */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-purple-500/30 bg-purple-950/30 shadow-inner group">
              <img
                src={imageUrl}
                alt={producto.nombre}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full badge-neon-purple">
                  {producto.categoria?.nombre || 'Tecnología'}
                </span>
                {producto.stock > 0 && (
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Disponible ({producto.stock} uds)
                  </span>
                )}
              </div>
            </div>

            {/* Sucursal de Despacho */}
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 flex items-center gap-3">
              <Building className="w-6 h-6 text-purple-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-purple-200">Garantía Comercial</p>
                <p className="text-[11px] text-purple-400/80">
                  Despacho asignado desde {selectedBodegaNombre} • Ref: #{producto.id}
                </p>
              </div>
            </div>
          </div>

          {/* Información del Producto */}
          <div className="flex flex-col justify-between h-full space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-purple-400 tracking-wider">
                  Ref: #{producto.id}
                </span>
                <span className="text-xs text-purple-300/70 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Auténtico NEXUS
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-3 text-neon-glow">
                {producto.nombre}
              </h2>

              <p className="text-sm text-purple-200/80 leading-relaxed mb-6">
                {producto.descripcion || 'Artículo de alta calidad comercial. Rendimiento superior y durabilidad garantizada.'}
              </p>

              {/* Bloque de Precio */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-purple-900/30 border border-purple-500/40 glow-purple-neon mb-6">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-3xl md:text-4xl font-black text-white">
                    ${precioNum.toFixed(2)}
                  </span>
                  <span className="text-xs text-purple-300/80 uppercase font-semibold">
                    + Impuestos ({(taxRate * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className="text-xs text-purple-300/70 flex justify-between pt-2 border-t border-purple-500/20">
                  <span>Precio Total Estimado:</span>
                  <span className="font-bold text-purple-200">${totalEst.toFixed(2)}</span>
                </div>
              </div>

              {/* Selector de Cantidad */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Cantidad:
                </span>
                <div className="flex items-center border border-purple-500/40 rounded-xl bg-purple-950/50 overflow-hidden">
                  <button
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    className="px-3.5 py-2 text-purple-300 hover:text-white hover:bg-purple-900/50 transition-colors font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-bold text-white min-w-[40px] text-center">
                    {cantidad}
                  </span>
                  <button
                    onClick={() => setCantidad(Math.min(producto.stock || 99, cantidad + 1))}
                    className="px-3.5 py-2 text-purple-300 hover:text-white hover:bg-purple-900/50 transition-colors font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-purple-400">
                  Max: {producto.stock} disponibles
                </span>
              </div>
            </div>

            {/* Acciones */}
            <div className="space-y-3 pt-4 border-t border-purple-500/20">
              <Button
                onClick={handleAddToCart}
                disabled={!producto.en_stock || producto.stock < 1}
                className="w-full h-13 text-base font-bold rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_0_25px_rgba(168,85,247,0.5)] border border-purple-300/40 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                {producto.stock > 0 ? `Añadir al Carrito — $${totalEst.toFixed(2)}` : 'Agotado'}
              </Button>

              {addedNotice && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold text-center animate-slide-down flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ¡Producto agregado al Carrito con éxito!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
