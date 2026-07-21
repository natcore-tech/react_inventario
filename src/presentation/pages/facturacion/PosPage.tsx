// src/presentation/pages/facturacion/PosPage.tsx
import { useEffect, useState } from 'react'
import {
  ShoppingCart,
  User as UserIcon,
  Search,
  Plus,
  Minus,
  Trash2,
  Lock,
  ArrowRight,
} from 'lucide-react'

import { useProductoStore } from '@/presentation/store/producto.store'
import { useClienteStore } from '@/presentation/store/cliente.store'
import { useTurnoAbiertoActual } from '@/presentation/store/turno-caja.store'
import { usePosStore, usePosTotalEstimado } from '@/presentation/store/pos.store'

import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import PosCobroDialog from './PosCobroDialog'
import { Link } from 'react-router-dom'

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function PosPage() {
  const turnoAbierto = useTurnoAbiertoActual()
  
  const { productos, loadProductos } = useProductoStore()
  const { clientes, loadClientes } = useClienteStore()
  const { 
    cartItems, 
    clienteId, 
    setCliente, 
    addItem, 
    removeItem, 
    updateQuantity, 
    clearCart 
  } = usePosStore()
  
  const totalEstimado = usePosTotalEstimado()

  const [searchQuery, setSearchQuery] = useState('')
  const [isCobroOpen, setIsCobroOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    loadProductos()
    loadClientes()
  }, [loadProductos, loadClientes])

  // ── Filtros ─────────────────────────────────────────────────────────────
  const productosFiltrados = productos.filter((p) => {
    if (!p.es_activo) return false
    if (!searchQuery) return true
    return (
      p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.codigo.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // ── Bloqueo si no hay turno ─────────────────────────────────────────────
  if (!turnoAbierto) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-6 p-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Lock className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="max-w-md">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Caja Cerrada
          </h2>
          <p className="mt-2 text-muted-foreground">
            Para poder facturar y usar el Punto de Venta, debes abrir un turno de caja primero.
          </p>
        </div>
        <Button asChild size="lg">
          <Link to="/billing/shifts">Ir a Turnos de Caja</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* ─── PANEL IZQUIERDO: CATÁLOGO DE PRODUCTOS ────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden border-r border-border">
        {/* Header Catálogo */}
        <div className="flex flex-col gap-4 border-b border-border p-4 bg-card shadow-sm z-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Punto de Venta
            </h1>
            <p className="text-sm text-muted-foreground">
              Turno #{turnoAbierto.id} — Cajero: {turnoAbierto.nombre_cajero}
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar producto por nombre o código..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
        </div>

        {/* Grilla de Productos */}
        <div className="flex-1 overflow-y-auto p-4 bg-muted/20">
          {successMessage && (
            <div className="mb-4 rounded-md bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-400 font-medium flex items-center justify-between">
              {successMessage}
              <Button variant="ghost" size="sm" onClick={() => setSuccessMessage(null)} className="h-auto py-1 px-2 hover:bg-emerald-500/20">Cerrar</Button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {productosFiltrados.map((prod) => (
              <button
                key={prod.id}
                onClick={() => addItem(prod)}
                disabled={prod.stock < 1}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm transition-all hover:border-primary/50 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex h-32 w-full shrink-0 items-center justify-center overflow-hidden bg-muted/30 text-muted-foreground border-b border-border">
                  {prod.image_url ? (
                    <img 
                      src={prod.image_url} 
                      alt={prod.nombre} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <ShoppingCart className="h-10 w-10 opacity-30" />
                  )}
                </div>

                <div className="flex w-full flex-col p-4 flex-1">
                  <div className="w-full space-y-1 flex-1">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-foreground">
                      {prod.nombre}
                    </h3>
                    <p className="text-xs text-muted-foreground">{prod.codigo}</p>
                  </div>
                  <div className="mt-4 flex w-full items-center justify-between border-t border-border pt-3">
                    <span className="font-bold text-foreground text-base">
                      ${parseFloat(prod.precio).toFixed(2)}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-md ${prod.stock > 10 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                      Stock: {prod.stock}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {productosFiltrados.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <Search className="mb-2 h-8 w-8 opacity-20" />
              <p>No se encontraron productos.</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── PANEL DERECHO: CARRITO Y COBRO ─────────────────────────────────── */}
      <div className="flex w-[400px] shrink-0 flex-col bg-card shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-20">
        
        {/* Selector de Cliente */}
        <div className="border-b border-border p-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider flex items-center gap-1">
              <UserIcon className="h-3 w-3" />
              Cliente
            </label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={clienteId ?? ''}
              onChange={(e) => setCliente(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Consumidor Final (Seleccionar...)</option>
              {clientes.filter(c => c.es_activo).map(c => (
                <option key={c.id} value={c.id}>
                  {c.nombres} — {c.identificacion}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground opacity-50">
              <ShoppingCart className="mb-4 h-12 w-12" />
              <p className="text-sm font-medium">El carrito está vacío</p>
              <p className="text-xs">Selecciona productos del catálogo</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.producto.id} className="flex flex-col gap-2 rounded-lg border border-border p-3 bg-background">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-semibold text-sm leading-tight text-foreground line-clamp-2">
                      {item.producto.nombre}
                    </span>
                    <span className="font-bold text-sm shrink-0 whitespace-nowrap">
                      ${item.subtotal_estimado.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-muted">
                      ${parseFloat(item.producto.precio).toFixed(2)} c/u
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-semibold text-foreground">
                        {item.cantidad}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}
                        disabled={item.cantidad >= item.producto.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 ml-1 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => removeItem(item.producto.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Totales y Cobro */}
        <div className="border-t border-border bg-muted/10 p-4 space-y-4">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal estimado</span>
              <span>${(totalEstimado / 1.15).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>IVA (15%) estimado</span>
              <span>${(totalEstimado - (totalEstimado / 1.15)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-1.5 text-xl font-black text-foreground">
              <span>Total Estimado</span>
              <span>${totalEstimado.toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2 leading-tight">
              * El total final exacto, incluyendo promociones aplicables, será calculado por el sistema al momento de facturar.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={clearCart}
              disabled={cartItems.length === 0}
            >
              Limpiar
            </Button>
            <Button
              size="lg"
              className="flex-[2] font-bold text-base shadow-md"
              disabled={cartItems.length === 0 || !clienteId}
              onClick={() => setIsCobroOpen(true)}
            >
              Cobrar
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* ── Dialog de Cobro ──────────────────────────────────────────────────── */}
      <PosCobroDialog
        open={isCobroOpen}
        onOpenChange={setIsCobroOpen}
        onSuccess={() => {
          setSuccessMessage('¡Venta registrada con éxito!')
          setTimeout(() => setSuccessMessage(null), 5000)
          loadProductos() // Recarga productos para actualizar stock visualmente
        }}
      />
    </div>
  )
}
