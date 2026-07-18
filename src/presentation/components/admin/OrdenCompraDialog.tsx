// Ruta: src/presentation/components/admin/OrdenCompraDialog.tsx

import { useState } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { useComprasStore } from '../../store/compras.store'
import { ApiException } from '../../../domain/exceptions/api.exception'
import { OrdenCompraForm, type OrdenCompraFormValues } from './OrdenCompraForm'

interface OrdenCompraDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrdenCompraDialog({ open, onOpenChange }: OrdenCompraDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const proveedores = useComprasStore((s) => s.proveedores)
  const createOrdenCompra = useComprasStore((s) => s.createOrdenCompra)

  async function handleSubmit(data: OrdenCompraFormValues) {
    setIsLoading(true)
    try {
      await createOrdenCompra(data)
      toast.success('Orden de compra creada', {
        description: `La orden "${data.codigo_orden}" fue creada correctamente.`,
      })
      setTimeout(() => onOpenChange(false), 0)
    } catch (err) {
      const message = err instanceof ApiException ? err.detail : 'No se pudo crear la orden de compra.'
      toast.error('Error', { description: message })
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nueva orden de compra</DialogTitle>
        </DialogHeader>
        <OrdenCompraForm proveedores={proveedores} onSubmit={handleSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}