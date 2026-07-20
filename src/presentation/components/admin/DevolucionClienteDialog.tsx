// src/presentation/components/admin/DevolucionClienteDialog.tsx
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog'
import { useDevolucionClienteStore } from '@/presentation/store/devolucion-cliente.store'
import { ApiException } from '@/domain/exceptions/api.exception'
import type { Producto } from '@/domain/entities/producto.entity'
import { DevolucionClienteForm, type DevolucionClienteFormValues } from './DevolucionClienteForm'

interface DevolucionClienteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productos: Producto[]
}

export default function DevolucionClienteDialog({ open, onOpenChange, productos }: DevolucionClienteDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const createDevolucion = useDevolucionClienteStore((s) => s.createDevolucion)

  useEffect(() => {
    if (open) setFormError(null)
  }, [open])

  async function handleSubmit(data: DevolucionClienteFormValues) {
    setIsSubmitting(true)
    setFormError(null)
    try {
      await createDevolucion(data)
      setTimeout(() => onOpenChange(false), 0)
    } catch (err) {
      const message = err instanceof ApiException ? err.detail : 'No se pudo registrar la devolución.'
      setFormError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nueva devolución de cliente</DialogTitle>
        </DialogHeader>

        {formError && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {formError}
          </div>
        )}

        <DevolucionClienteForm onSubmit={handleSubmit} isLoading={isSubmitting} productos={productos} />
      </DialogContent>
    </Dialog>
  )
}