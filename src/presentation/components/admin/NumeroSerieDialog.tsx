// src/presentation/components/admin/NumeroSerieDialog.tsx
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog'
import { useNumeroSerieStore } from '@/presentation/store/numero-serie.store'
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
  const createNumeroSerie = useNumeroSerieStore((s) => s.createNumeroSerie)
  const updateNumeroSerie = useNumeroSerieStore((s) => s.updateNumeroSerie)

  const isEditing = Boolean(numeroSerie)

  async function handleSubmit(data: NumeroSerieFormValues) {
    setIsSubmitting(true)
    try {
      if (isEditing && numeroSerie) {
        await updateNumeroSerie(numeroSerie.id, data)
      } else {
        await createNumeroSerie(data)
      }
      onOpenChange(false)
    } catch {
      // El error ya queda en useNumeroSerieStore.error; la página lo muestra.
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