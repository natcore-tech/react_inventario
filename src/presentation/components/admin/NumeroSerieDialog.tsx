// src/presentation/components/admin/NumeroSerieDialog.tsx
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog'
import { useNumeroSerieStore } from '@/presentation/store/numero-serie.store'
import { ApiException } from '@/domain/exceptions/api.exception'
import type { Producto } from '@/domain/entities/producto.entity'
import type { NumeroSerie } from '@/domain/entities/numero-serie.entity'
import { NumeroSerieForm, type NumeroSerieFormValues } from './NumeroSerieForm'

interface NumeroSerieDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productos: Producto[]
  numeroSerie?: NumeroSerie | null
  defaultProductoId?: number
}

export default function NumeroSerieDialog({
  open,
  onOpenChange,
  productos,
  numeroSerie,
  defaultProductoId,
}: NumeroSerieDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const createNumeroSerie = useNumeroSerieStore((s) => s.createNumeroSerie)
  const updateNumeroSerie = useNumeroSerieStore((s) => s.updateNumeroSerie)

  const isEditing = Boolean(numeroSerie)

  // Limpia el error anterior cada vez que se abre el diálogo de nuevo.
  useEffect(() => {
    if (open) setFormError(null)
  }, [open])

  async function handleSubmit(data: NumeroSerieFormValues) {
    setIsSubmitting(true)
    setFormError(null)
    try {
      if (isEditing && numeroSerie) {
        await updateNumeroSerie(numeroSerie.id, data)
      } else {
        await createNumeroSerie(data)
      }
      setTimeout(() => onOpenChange(false), 0)
    } catch (err) {
      const message =
        err instanceof ApiException
          ? (err.fieldErrors?.codigo_serial?.[0] ?? err.detail)
          : 'No se pudo guardar el número de serie.'
      setFormError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const defaultValues: Partial<NumeroSerieFormValues> | undefined = numeroSerie
    ? {
        producto: numeroSerie.producto,
        codigo_serial: numeroSerie.codigo_serial,
        estado: numeroSerie.estado,
      }
    : undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar número de serie' : 'Nuevo número de serie'}</DialogTitle>
        </DialogHeader>

        {formError && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {formError}
          </div>
        )}

        <NumeroSerieForm
          key={numeroSerie?.id ?? 'new'}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          productos={productos}
          defaultProductoId={defaultProductoId}
        />
      </DialogContent>
    </Dialog>
  )
}