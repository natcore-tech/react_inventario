// src/presentation/components/admin/AlertaStockMinimoDialog.tsx
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog'
import { useAlertaStockMinimoStore } from '@/presentation/store/alerta-stock-minimo.store'
import { ApiException } from '@/domain/exceptions/api.exception'
import type { Producto } from '@/domain/entities/producto.entity'
import type { AlertaStockMinimo } from '@/domain/entities/alerta-stock-minimo.entity'
import { AlertaStockMinimoForm } from './AlertaStockMinimoForm'

interface AlertaStockMinimoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Productos SIN alerta previa (ya filtrados por la página) — o el propio si se edita. */
  productosDisponibles: Producto[]
  alerta?: AlertaStockMinimo | null
}

export default function AlertaStockMinimoDialog({
  open,
  onOpenChange,
  productosDisponibles,
  alerta,
}: AlertaStockMinimoDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const createAlerta = useAlertaStockMinimoStore((s) => s.createAlerta)
  const updateAlerta = useAlertaStockMinimoStore((s) => s.updateAlerta)

  const isEditing = Boolean(alerta)

  useEffect(() => {
    if (open) setFormError(null)
  }, [open])

  async function handleSubmit(data: {
    producto: number
    cantidad_minima: number
    email_notificacion: string
    activa: boolean
  }) {
    setIsSubmitting(true)
    setFormError(null)
    try {
      if (isEditing && alerta) {
        await updateAlerta(alerta.id, data)
      } else {
        await createAlerta(data)
      }
      setTimeout(() => onOpenChange(false), 0)
    } catch (err) {
      const message =
        err instanceof ApiException
          ? (err.fieldErrors?.producto?.[0] ?? err.detail)
          : 'No se pudo guardar la alerta.'
      setFormError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar alerta de stock' : 'Nueva alerta de stock'}</DialogTitle>
        </DialogHeader>

        {formError && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {formError}
          </div>
        )}

        <AlertaStockMinimoForm
          key={alerta?.id ?? 'new'}
          defaultValues={alerta ?? undefined}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          productos={productosDisponibles}
          disableProducto={isEditing}
        />
      </DialogContent>
    </Dialog>
  )
}