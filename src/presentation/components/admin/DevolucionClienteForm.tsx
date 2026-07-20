// src/presentation/components/admin/DevolucionClienteForm.tsx
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'

import { Input } from '@/presentation/components/ui/input'
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
import {
  ESTADO_PRODUCTO_DEVOLUCION_LABELS,
  type EstadoProductoDevolucion,
} from '@/domain/entities/devolucion-cliente.entity'
import type { Producto } from '@/domain/entities/producto.entity'

const devolucionSchema = z.object({
  producto: z.coerce.number({ message: 'Selecciona un producto' }).positive('Selecciona un producto'),
  cantidad: z.coerce.number({ message: 'Ingresa una cantidad válida' }).int('Debe ser un número entero').positive('Debe ser mayor a 0'),
  estado_producto: z.enum(['BUENO', 'DANO', 'USADO'], { message: 'Selecciona el estado del producto' }),
  motivo: z.string().min(10, 'Describe el motivo con al menos 10 caracteres').max(1000, 'Máximo 1000 caracteres'),
})

export type DevolucionClienteFormValues = z.infer<typeof devolucionSchema>

interface DevolucionClienteFormProps {
  onSubmit: (data: DevolucionClienteFormValues) => Promise<void>
  isLoading?: boolean
  productos: Producto[]
}

const ESTADO_OPTIONS: EstadoProductoDevolucion[] = ['BUENO', 'DANO', 'USADO']

export function DevolucionClienteForm({ onSubmit, isLoading = false, productos }: DevolucionClienteFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DevolucionClienteFormValues>({
    resolver: zodResolver(devolucionSchema as never),
    defaultValues: {
      producto: 0,
      cantidad: 1,
      estado_producto: 'BUENO',
      motivo: '',
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
              disabled={isLoading}
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
        {errors.producto && <p className="text-xs text-destructive">{errors.producto.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="cantidad">Cantidad devuelta</Label>
          <Input
            id="cantidad"
            type="number"
            min="1"
            step="1"
            disabled={isLoading}
            aria-invalid={!!errors.cantidad}
            {...register('cantidad')}
          />
          {errors.cantidad && <p className="text-xs text-destructive">{errors.cantidad.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="estado_producto">Estado del producto</Label>
          <Controller
            control={control}
            name="estado_producto"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                <SelectTrigger id="estado_producto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ESTADO_OPTIONS.map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {ESTADO_PRODUCTO_DEVOLUCION_LABELS[estado]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Solo "Buen Estado" reingresa la cantidad al stock automáticamente. "Dañado" y "Usado" no lo hacen.
      </p>

      <div className="space-y-1">
        <Label htmlFor="motivo">Motivo de la devolución</Label>
        <Textarea
          id="motivo"
          placeholder="Describe por qué el cliente devolvió el producto..."
          rows={3}
          disabled={isLoading}
          aria-invalid={!!errors.motivo}
          {...register('motivo')}
        />
        {errors.motivo && <p className="text-xs text-destructive">{errors.motivo.message}</p>}
      </div>

      <div className="flex justify-end pt-2">
        <Button id="btn-guardar-devolucion" type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Guardando…' : 'Registrar devolución'}
        </Button>
      </div>
    </form>
  )
}