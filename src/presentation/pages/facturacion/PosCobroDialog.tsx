// src/presentation/pages/facturacion/PosCobroDialog.tsx
import { useState, useEffect } from 'react'
import { Loader2, DollarSign } from 'lucide-react'

import { useVentaStore } from '@/presentation/store/venta.store'
import { usePosStore, usePosTotalEstimado } from '@/presentation/store/pos.store'
import { useMetodoPagoStore } from '@/presentation/store/metodo-pago.store'
import type { CreateVentaDto } from '@/application/dtos/venta.dto'

import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog'

interface PosCobroDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function PosCobroDialog({ open, onOpenChange, onSuccess }: PosCobroDialogProps) {
  const { crearVenta, isSaving, error: ventaError, clearError } = useVentaStore()
  const { cartItems, clienteId, clearCart } = usePosStore()
  const { metodosPago, loadMetodosPago } = useMetodoPagoStore()
  
  const totalEstimado = usePosTotalEstimado()

  const [metodoSeleccionado, setMetodoSeleccionado] = useState<number | null>(null)
  const [montoEntregado, setMontoEntregado] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      loadMetodosPago()
      setMetodoSeleccionado(null)
      setMontoEntregado(totalEstimado.toFixed(2)) // Sugerir el total exacto por defecto
      setFormError(null)
      clearError()
    }
  }, [open, loadMetodosPago, totalEstimado, clearError])

  async function handleCobrar(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    if (!clienteId) return setFormError('Falta seleccionar un cliente.')
    if (cartItems.length === 0) return setFormError('El carrito está vacío.')
    if (!metodoSeleccionado) return setFormError('Selecciona un método de pago.')

    const monto = parseFloat(montoEntregado)
    if (isNaN(monto) || monto < 0) {
      return setFormError('Monto inválido.')
    }

    const dto: CreateVentaDto = {
      cliente: clienteId,
      detalles: cartItems.map(i => ({
        producto: i.producto.id,
        cantidad: i.cantidad
      })),
      pagos: [
        {
          metodo_pago: metodoSeleccionado,
          monto
        }
      ]
    }

    try {
      await crearVenta(dto)
      clearCart()
      onSuccess()
      onOpenChange(false)
    } catch {
      // Manejado globalmente
    }
  }

  const vuelto = parseFloat(montoEntregado) - totalEstimado

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <DollarSign className="h-6 w-6 text-primary" />
            Cobrar Factura
          </DialogTitle>
        </DialogHeader>

        <form id="cobro-form" onSubmit={handleCobrar} className="space-y-6 py-4">
          {(ventaError || formError) && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {formError ?? ventaError}
            </div>
          )}

          {/* Resumen */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
            <p className="text-sm font-medium text-muted-foreground mb-1">Total a Pagar (Estimado)</p>
            <p className="text-4xl font-bold text-foreground tracking-tighter">
              ${totalEstimado.toFixed(2)}
            </p>
          </div>

          {/* Método de Pago */}
          <div className="space-y-3">
            <Label>Método de Pago</Label>
            <div className="grid grid-cols-2 gap-3">
              {metodosPago.filter(m => m.es_activo).map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMetodoSeleccionado(m.id)
                    setFormError(null)
                  }}
                  className={`flex items-center justify-center rounded-lg border p-3 text-sm font-medium transition-colors ${
                    metodoSeleccionado === m.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {m.nombre}
                </button>
              ))}
            </div>
          </div>

          {/* Monto Entregado */}
          <div className="space-y-2">
            <Label htmlFor="cobro-monto">Monto Entregado ($)</Label>
            <Input
              id="cobro-monto"
              type="number"
              step="0.01"
              min={0}
              value={montoEntregado}
              onChange={(e) => setMontoEntregado(e.target.value)}
              className="text-lg font-medium"
              disabled={isSaving}
              required
            />
          </div>

          {/* Vuelto */}
          {vuelto > 0 && (
            <div className="flex justify-between items-center rounded-md bg-muted/40 p-3 text-sm">
              <span className="font-medium">Cambio a entregar:</span>
              <span className="text-lg font-bold text-emerald-600">${vuelto.toFixed(2)}</span>
            </div>
          )}
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" form="cobro-form" size="lg" className="w-full sm:w-auto font-semibold" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              'Confirmar Pago'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
