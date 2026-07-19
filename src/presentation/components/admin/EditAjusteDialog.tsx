// src/presentation/components/admin/EditAjusteDialog.tsx
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select'
import { useAjusteInventarioStore } from '@/presentation/store/ajuste-inventario.store'
import { ApiException } from '@/domain/exceptions/api.exception'
import {
  TIPO_AJUSTE_LABELS,
  type AjusteInventario,
  type TipoAjuste,
} from '@/domain/entities/ajuste-inventario.entity'
import { getCantidadColor, formatCantidadSigno } from '@/presentation/utils/ajuste-tipo-colors'

const editSchema = z.object({
  tipo_ajuste: z.enum(['ROBO', 'DANO', 'CADUCIDAD', 'ERROR']),
  justificativo: z.string().min(10, 'Mínimo 10 caracteres').max(1000, 'Máximo 1000 caracteres'),
})

type EditFormValues = z.infer<typeof editSchema>

const TIPO_OPTIONS: TipoAjuste[] = ['ROBO', 'DANO', 'CADUCIDAD', 'ERROR']

interface EditAjusteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ajuste: AjusteInventario
  productoNombre: string
}

export default function EditAjusteDialog({ open, onOpenChange, ajuste, productoNombre }: EditAjusteDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const updateAjuste = useAjusteInventarioStore((s) => s.updateAjuste)

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema as never),
    defaultValues: {
      tipo_ajuste: ajuste.tipo_ajuste,
      justificativo: ajuste.justificativo,
    },
  })

  useEffect(() => {
    if (open) setFormError(null)
  }, [open])

  async function onSubmit(data: EditFormValues) {
    setIsSubmitting(true)
    setFormError(null)
    try {
      await updateAjuste(ajuste.id, data)
      setTimeout(() => onOpenChange(false), 0)
    } catch (err) {
      const message = err instanceof ApiException ? err.detail : 'No se pudo actualizar el ajuste.'
      setFormError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar ajuste</DialogTitle>
          <DialogDescription>{productoNombre}</DialogDescription>
        </DialogHeader>

        {formError && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {formError}
          </div>
        )}

        {/* Producto y cantidad de solo lectura: el backend no recalcula el
            stock en update(), así que no se permiten editar aquí. */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3">
          <span className="text-sm text-muted-foreground">Cantidad registrada (no editable)</span>
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: getCantidadColor(ajuste.cantidad), color: '#FFFFFF' }}
          >
            {formatCantidadSigno(ajuste.cantidad)}
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="tipo_ajuste">Tipo de ajuste</Label>
            <Controller
              control={control}
              name="tipo_ajuste"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                  <SelectTrigger id="tipo_ajuste">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPO_OPTIONS.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {TIPO_AJUSTE_LABELS[tipo]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="justificativo">Justificativo</Label>
            <Textarea
              id="justificativo"
              rows={3}
              disabled={isSubmitting}
              aria-invalid={!!errors.justificativo}
              {...register('justificativo')}
            />
            {errors.justificativo && (
              <p className="text-xs text-destructive">{errors.justificativo.message}</p>
            )}
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