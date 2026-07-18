// src/presentation/components/admin/NumeroSerieForm.tsx
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
import { ESTADO_NUMERO_SERIE_LABELS, type EstadoNumeroSerie } from '@/domain/entities/numero-serie.entity'
import type { Producto } from '@/domain/entities/producto.entity'

const numeroSerieSchema = z.object({
  producto: z.coerce.number({ message: 'Selecciona un producto' }).positive('Selecciona un producto'),
  codigo_serial: z
    .string()
    .min(1, 'El número de serie/IMEI es obligatorio')
    .max(100, 'Máximo 100 caracteres'),
  estado: z.enum(['DISPONIBLE', 'VENDIDO', 'DANO']),
})

export type NumeroSerieFormValues = z.infer<typeof numeroSerieSchema>

interface NumeroSerieFormProps {
  defaultValues?: Partial<NumeroSerieFormValues>
  onSubmit: (data: NumeroSerieFormValues) => Promise<void>
  isLoading?: boolean
  productos: Producto[]
  defaultProductoId?: number
}

const ESTADO_OPTIONS: EstadoNumeroSerie[] = ['DISPONIBLE', 'VENDIDO', 'DANO']

export function NumeroSerieForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  productos,
  defaultProductoId,
}: NumeroSerieFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NumeroSerieFormValues>({
    resolver: zodResolver(numeroSerieSchema as never),
    defaultValues: {
      producto: defaultValues?.producto ?? defaultProductoId ?? 0,
      codigo_serial: defaultValues?.codigo_serial ?? '',
      estado: defaultValues?.estado ?? 'DISPONIBLE',
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
              disabled={isLoading || Boolean(defaultProductoId)}
            >
              <SelectTrigger id="producto" aria-invalid={!!errors.producto}>
                <SelectValue placeholder="Selecciona un producto" />
              </SelectTrigger>
              <SelectContent>
                {productos.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.producto && <p className="text-xs text-destructive">{errors.producto.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="codigo_serial">Número de serie / IMEI</Label>
        <Input
          id="codigo_serial"
          placeholder="Ej. 359123456789012"
          disabled={isLoading}
          aria-invalid={!!errors.codigo_serial}
          {...register('codigo_serial')}
        />
        <p className="text-xs text-muted-foreground">Debe ser único — el backend rechaza duplicados.</p>
        {errors.codigo_serial && (
          <p className="text-xs text-destructive">{errors.codigo_serial.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="estado">Estado</Label>
        <Controller
          control={control}
          name="estado"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
              <SelectTrigger id="estado">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ESTADO_OPTIONS.map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {ESTADO_NUMERO_SERIE_LABELS[estado]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button id="btn-guardar-numero-serie" type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Guardando…' : 'Guardar'}
        </Button>
      </div>
    </form>
  )
}