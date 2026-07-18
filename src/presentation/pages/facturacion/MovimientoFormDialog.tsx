// src/presentation/pages/facturacion/MovimientoFormDialog.tsx
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

import { useMovimientoInventarioStore } from '@/presentation/store/movimiento-inventario.store'
import { useProductoStore } from '@/presentation/store/producto.store'
import { useProveedorStore } from '@/presentation/store/proveedor.store'
import type { CreateMovimientoInventarioDto } from '@/application/dtos/movimiento-inventario.dto'
import type { TipoMovimiento } from '@/domain/entities/movimiento-inventario.entity'

import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Textarea } from '@/presentation/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog'

interface MovimientoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function MovimientoFormDialog({ open, onOpenChange, onSuccess }: MovimientoFormDialogProps) {
  const { crearMovimiento, isSaving, error, clearError } = useMovimientoInventarioStore()
  const { productos, loadProductos } = useProductoStore()
  const { proveedores, loadProveedores } = useProveedorStore()
  
  const [producto, setProducto] = useState('')
  const [tipo, setTipo] = useState<TipoMovimiento>('ENTRADA')
  const [cantidad, setCantidad] = useState('1')
  const [proveedor, setProveedor] = useState('')
  const [motivo, setMotivo] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      loadProductos()
      loadProveedores()
      setProducto('')
      setTipo('ENTRADA')
      setCantidad('1')
      setProveedor('')
      setMotivo('')
      setFormError(null)
      clearError()
    }
  }, [open, loadProductos, loadProveedores, clearError])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    if (!producto) return setFormError('Debes seleccionar un producto.')
    if (tipo === 'ENTRADA' && !proveedor) return setFormError('Debes seleccionar un proveedor para entradas.')

    const qty = parseInt(cantidad, 10)
    if (isNaN(qty) || qty < 1) {
      return setFormError('La cantidad debe ser mayor o igual a 1.')
    }

    const dto: CreateMovimientoInventarioDto = {
      producto: Number(producto),
      tipo,
      cantidad: qty,
      motivo: motivo.trim() || undefined,
      proveedor: tipo === 'ENTRADA' ? Number(proveedor) : undefined
    }

    try {
      await crearMovimiento(dto)
      onSuccess?.()
      onOpenChange(false)
    } catch {
      // Error is handled in the store
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Movimiento</DialogTitle>
        </DialogHeader>

        <form id="movimiento-form" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4 py-4">
            {(error || formError) && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError ?? error}
              </div>
            )}

            <div className="space-y-2">
              <Label>Tipo de Movimiento</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoMovimiento)}
                disabled={isSaving}
              >
                <option value="ENTRADA">Entrada (Compra/Ingreso)</option>
                <option value="SALIDA">Salida (Venta/Egreso)</option>
                <option value="AJUSTE_POS">Ajuste Positivo</option>
                <option value="AJUSTE_NEG">Ajuste Negativo</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Producto</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={producto}
                onChange={(e) => setProducto(e.target.value)}
                disabled={isSaving}
              >
                <option value="">Seleccionar producto...</option>
                {productos.filter(p => p.es_activo).map(p => (
                  <option key={p.id} value={p.id}>
                    {p.codigo} - {p.nombre} (Stock: {p.stock})
                  </option>
                ))}
              </select>
            </div>

            {tipo === 'ENTRADA' && (
              <div className="space-y-2 animate-in fade-in zoom-in duration-200">
                <Label>Proveedor</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={proveedor}
                  onChange={(e) => setProveedor(e.target.value)}
                  disabled={isSaving}
                >
                  <option value="">Seleccionar proveedor...</option>
                  {proveedores.filter(p => p.es_activo).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
                {proveedores.length === 0 && (
                  <p className="text-xs text-amber-600">No hay proveedores creados o activos.</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="mov-cantidad">Cantidad</Label>
              <Input
                id="mov-cantidad"
                type="number"
                min="1"
                step="1"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                disabled={isSaving}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mov-motivo">Motivo / Observación (Opcional)</Label>
              <Textarea
                id="mov-motivo"
                placeholder="Factura #123, inventario manual, rotura..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                disabled={isSaving}
                rows={3}
              />
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" form="movimiento-form" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registrando...
              </>
            ) : (
              'Confirmar Movimiento'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
