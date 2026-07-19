// src/presentation/components/admin/AlertaStockMinimoForm.tsx
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'

import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Button } from '@/presentation/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select'
import type { Producto } from '@/domain/entities/producto.entity'

const alertaSchema = z.object({
  producto: z.coerce.number({ message: 'Selecciona un producto' }).positive('Selecciona un producto'),
  cantidad_minima: z.coerce
    .number({ message: 'Ingresa un valor válido' })
    .int('Debe ser un número entero')
    .min(0, 'No puede ser negativo'),
  email_notificacion: z.string().email('Ingresa un correo válido'),
  activa: z.enum(['true', 'false']).transform((v) => v === 'true'),
})

export type AlertaStockMinimoFormValues = z.input<typeof alertaSchema>
type AlertaStockMinimoFormOutput = z.output<typeof alertaSchema>

interface AlertaStockMinimoFormProps {
  defaultValues?: Partial<{
    producto: number
    cantidad_minima: number
    email_notificacion: string
    activa: boolean
  }>
  onSubmit: (data: AlertaStockMinimoFormOutput) => Promise<void>
  isLoading?: boolean
  /** Productos disponibles para elegir (ya filtrados: sin alerta previa, o incluyendo el propio si se edita). */
  productos: Producto[]
  disableProducto?: boolean
}

export function AlertaStockMinimoForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  productos,
  disableProducto = false,
}: AlertaStockMinimoFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AlertaStockMinimoFormValues, unknown, AlertaStockMinimoFormOutput>({
    resolver: zodResolver(alertaSchema),
    defaultValues: {
      producto: defaultValues?.producto ?? 0,
      cantidad_minima: defaultValues?.cantidad_minima ?? 5,
      email_notificacion: defaultValues?.email_notificacion ?? '',
      activa: defaultValues?.activa === undefined ? 'true' : defaultValues.activa ? 'true' : 'false',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="producto">Producto</Label>
        <Controller
          control={control}
          name="producto"
          render={({ field }) => (
            <Select
              onValueChange={(value) => field.onChange(Number(value))}
              value={field.value ? String(field.value) : undefined}
              disabled={isLoading || disableProducto}
            >
              <SelectTrigger id="producto" aria-invalid={!!errors.producto}>
                <SelectValue placeholder="Selecciona un producto" />
              </SelectTrigger>
              <SelectContent>
                {productos.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.nombre} — stock actual: {p.stock}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {productos.length === 0 && !disableProducto && (
          <p className="text-xs text-muted-foreground">
            Todos los productos ya tienen una alerta configurada.
          </p>
        )}
        {errors.producto && <p className="text-xs text-destructive">{errors.producto.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="cantidad_minima">Stock mínimo para alerta</Label>
        <Input
          id="cantidad_minima"
          type="number"
          min="0"
          step="1"
          disabled={isLoading}
          aria-invalid={!!errors.cantidad_minima}
          {...register('cantidad_minima')}
        />
        {errors.cantidad_minima && (
          <p className="text-xs text-destructive">{errors.cantidad_minima.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="email_notificacion">Correo para notificación de compras</Label>
        <Input
          id="email_notificacion"
          type="email"
          placeholder="compras@empresa.com"
          disabled={isLoading}
          aria-invalid={!!errors.email_notificacion}
          {...register('email_notificacion')}
        />
        {errors.email_notificacion && (
          <p className="text-xs text-destructive">{errors.email_notificacion.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="activa">Estado</Label>
        <Controller
          control={control}
          name="activa"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
              <SelectTrigger id="activa">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Activa</SelectItem>
                <SelectItem value="false">Inactiva</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button id="btn-guardar-alerta" type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Guardando…' : 'Guardar'}
        </Button>
      </div>
    </form>
  )
}