// src/presentation/components/admin/AjusteInventarioForm.tsx
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
import { TIPO_AJUSTE_LABELS, type TipoAjuste } from '@/domain/entities/ajuste-inventario.entity'
import type { Producto } from '@/domain/entities/producto.entity'

const ajusteSchema = z.object({
  producto: z.coerce.number({ message: 'Selecciona un producto' }).positive('Selecciona un producto'),
  tipo_ajuste: z.enum(['ROBO', 'DANO', 'CADUCIDAD', 'ERROR'], { message: 'Selecciona un tipo de ajuste' }),
  cantidad: z.coerce
    .number({ message: 'Ingresa una cantidad válida' })
    .int('La cantidad debe ser un número entero')
    .refine((v) => v !== 0, 'La cantidad no puede ser 0'),
  justificativo: z
    .string()
    .min(10, 'Describe el motivo con al menos 10 caracteres (queda como respaldo legal)')
    .max(1000, 'Máximo 1000 caracteres'),
})

export type AjusteInventarioFormValues = z.infer<typeof ajusteSchema>

interface AjusteInventarioFormProps {
  onSubmit: (data: AjusteInventarioFormValues) => Promise<void>
  isLoading?: boolean
  productos: Producto[]
  defaultProductoId?: number
}

const TIPO_OPTIONS: TipoAjuste[] = ['ROBO', 'DANO', 'CADUCIDAD', 'ERROR']

export function AjusteInventarioForm({
  onSubmit,
  isLoading = false,
  productos,
  defaultProductoId,
}: AjusteInventarioFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AjusteInventarioFormValues>({
    resolver: zodResolver(ajusteSchema as never),
    defaultValues: {
      producto: defaultProductoId ?? 0,
      tipo_ajuste: 'ERROR',
      cantidad: 0,
      justificativo: '',
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
                    {p.nombre} — stock actual: {p.stock}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.producto && <p className="text-xs text-destructive">{errors.producto.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="tipo_ajuste">Tipo de ajuste</Label>
        <Controller
          control={control}
          name="tipo_ajuste"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
              <SelectTrigger id="tipo_ajuste">
                <SelectValue placeholder="Selecciona un tipo" />
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
        {errors.tipo_ajuste && <p className="text-xs text-destructive">{errors.tipo_ajuste.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="cantidad">Cantidad</Label>
        <Input
          id="cantidad"
          type="number"
          step="1"
          placeholder="Usa negativos para disminuir stock, positivos para aumentar"
          disabled={isLoading}
          aria-invalid={!!errors.cantidad}
          {...register('cantidad')}
        />
        <p className="text-xs text-muted-foreground">
          Ej: -5 si se perdieron 5 unidades, +3 si aparecieron 3 de más en un conteo.
        </p>
        {errors.cantidad && <p className="text-xs text-destructive">{errors.cantidad.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="justificativo">Justificativo</Label>
        <Textarea
          id="justificativo"
          placeholder="Describe el motivo del ajuste (queda como respaldo legal/auditoría)..."
          rows={3}
          disabled={isLoading}
          aria-invalid={!!errors.justificativo}
          {...register('justificativo')}
        />
        {errors.justificativo && (
          <p className="text-xs text-destructive">{errors.justificativo.message}</p>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <Button id="btn-guardar-ajuste" type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Guardando…' : 'Registrar ajuste'}
        </Button>
      </div>
    </form>
  )
}