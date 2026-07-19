// Ruta: src/presentation/components/admin/CambiarEstadoOrdenDialog.tsx
// Nota: segun lo definido, el backend NO soporta editar items de una orden
// ya creada, solo cambiar su estado (Recibida / Cancelada).

import { useState } from 'react'
import { toast } from 'sonner'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { useComprasStore } from '../../store/compras.store'
import { ApiException } from '../../../domain/exceptions/api.exception'
import type { OrdenCompra } from '../../../domain/entities/orden-compra.entity'

interface CambiarEstadoOrdenDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orden: OrdenCompra
}

export function CambiarEstadoOrdenDialog({ open, onOpenChange, orden }: CambiarEstadoOrdenDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const cambiarEstadoOrdenCompra = useComprasStore((s) => s.cambiarEstadoOrdenCompra)

  async function handleCambiarEstado(nuevoEstado: 'RECIBIDA' | 'CANCELADA') {
    setIsLoading(true)
    try {
      await cambiarEstadoOrdenCompra(orden.id, nuevoEstado)
      toast.success('Estado actualizado', {
        description: `La orden "${orden.codigo_orden}" ahora esta ${
          nuevoEstado === 'RECIBIDA' ? 'Recibida' : 'Cancelada'
        }.`,
      })
      setTimeout(() => onOpenChange(false), 0)
    } catch (err) {
      const message = err instanceof ApiException ? err.detail : 'No se pudo cambiar el estado.'
      toast.error('Error', { description: message })
      setIsLoading(false)
    }
  }

  const yaFinalizada = orden.estado !== 'PENDIENTE'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Cambiar estado de la orden</DialogTitle>
          <DialogDescription>
            {orden.codigo_orden} — {orden.proveedor_nombre}
          </DialogDescription>
        </DialogHeader>

        {yaFinalizada ? (
          <p className="text-sm text-muted-foreground">
            Esta orden ya esta marcada como <strong>{orden.estado_display}</strong> y no se puede
            modificar de nuevo.
          </p>
        ) : (
          <div className="flex flex-col gap-2 pt-2">
            <Button
              type="button"
              disabled={isLoading}
              onClick={() => handleCambiarEstado('RECIBIDA')}
              className="justify-start"
            >
              <Loader2 className={`mr-2 h-4 w-4 animate-spin ${isLoading ? '' : 'hidden'}`} />
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Marcar como Recibida
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isLoading}
              onClick={() => handleCambiarEstado('CANCELADA')}
              className="justify-start"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancelar orden
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}