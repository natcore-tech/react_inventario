// src/presentation/components/admin/EditDevolucionDialog.tsx
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/presentation/components/ui/dialog'
import { Label } from '@/presentation/components/ui/label'
import { Textarea } from '@/presentation/components/ui/textarea'
import { Button } from '@/presentation/components/ui/button'
import { useDevolucionClienteStore } from '@/presentation/store/devolucion-cliente.store'
import { ApiException } from '@/domain/exceptions/api.exception'
import {
  ESTADO_PRODUCTO_DEVOLUCION_LABELS,
  type DevolucionCliente,
} from '@/domain/entities/devolucion-cliente.entity'
import { ESTADO_DEVOLUCION_COLORS } from '@/presentation/utils/devolucion-estado-colors'

const editSchema = z.object({
  motivo: z.string().min(10, 'Mínimo 10 caracteres').max(1000, 'Máximo 1000 caracteres'),
})

type EditFormValues = z.infer<typeof editSchema>

interface EditDevolucionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  devolucion: DevolucionCliente
  productoNombre: string
}

export default function EditDevolucionDialog({
  open,
  onOpenChange,
  devolucion,
  productoNombre,
}: EditDevolucionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const updateDevolucion = useDevolucionClienteStore((s) => s.updateDevolucion)

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: { motivo: devolucion.motivo },
  })

  useEffect(() => {
    if (open) setFormError(null)
  }, [open])

  async function onSubmit(data: EditFormValues) {
    setIsSubmitting(true)
    setFormError(null)
    try {
      await updateDevolucion(devolucion.id, data)
      setTimeout(() => onOpenChange(false), 0)
    } catch (err) {
      const message = err instanceof ApiException ? err.detail : 'No se pudo actualizar la devolución.'
      setFormError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const estadoStyle = ESTADO_DEVOLUCION_COLORS[devolucion.estado_producto]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar devolución</DialogTitle>
          <DialogDescription>{productoNombre}</DialogDescription>
        </DialogHeader>

        {formError && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {formError}
          </div>
        )}

        {/* Cantidad y estado de solo lectura: la señal post_save solo aplica
            el reingreso de stock en la creación (created=True) — editar
            estos campos después no vuelve a recalcular nada en el backend. */}
        <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Cantidad (no editable)</span>
            <span className="font-mono font-semibold text-foreground">{devolucion.cantidad}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Estado (no editable)</span>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ backgroundColor: estadoStyle.bg, color: estadoStyle.text }}
            >
              {ESTADO_PRODUCTO_DEVOLUCION_LABELS[devolucion.estado_producto]}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="motivo">Motivo</Label>
            <Textarea
              id="motivo"
              rows={3}
              disabled={isSubmitting}
              aria-invalid={!!errors.motivo}
              {...register('motivo')}
            />
            {errors.motivo && <p className="text-xs text-destructive">{errors.motivo.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}