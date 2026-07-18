// src/presentation/components/admin/AjusteInventarioDialog.tsx
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog'
import { useAjusteInventarioStore } from '@/presentation/store/ajuste-inventario.store'
import { ApiException } from '@/domain/exceptions/api.exception'
import type { Producto } from '@/domain/entities/producto.entity'
import { AjusteInventarioForm, type AjusteInventarioFormValues } from './AjusteInventarioForm'

interface AjusteInventarioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productos: Producto[]
  defaultProductoId?: number
}

export default function AjusteInventarioDialog({
  open,
  onOpenChange,
  productos,
  defaultProductoId,
}: AjusteInventarioDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const createAjuste = useAjusteInventarioStore((s) => s.createAjuste)

  useEffect(() => {
    if (open) setFormError(null)
  }, [open])

  async function handleSubmit(data: AjusteInventarioFormValues) {
    setIsSubmitting(true)
    setFormError(null)
    try {
      await createAjuste(data)
      setTimeout(() => onOpenChange(false), 0)
    } catch (err) {
      const message = err instanceof ApiException ? err.detail : 'No se pudo registrar el ajuste.'
      setFormError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nuevo ajuste de inventario</DialogTitle>
        </DialogHeader>

        {formError && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {formError}
          </div>
        )}

        <AjusteInventarioForm
          key={defaultProductoId ?? 'no-default'}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          productos={productos}
          defaultProductoId={defaultProductoId}
        />
      </DialogContent>
    </Dialog>
  )
}