// src/presentation/components/admin/ProveedorForm.tsx


import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'

import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { Button } from '../ui/button'



const proveedorSchema = z.object({
  nombre: z.string().min(2, 'Minimo 2 caracteres').max(150, 'Maximo 150 caracteres'),
  ruc: z.string().min(1, 'El RUC es obligatorio').max(13, 'Maximo 13 caracteres'),
  telefono: z.string().max(20, 'Maximo 20 caracteres').optional().or(z.literal('')),
  email: z.string().email('Email invalido').optional().or(z.literal('')),
  direccion: z.string().optional().or(z.literal('')),
  es_activo: z.boolean(),
})

export type ProveedorFormValues = z.infer<typeof proveedorSchema>

interface ProveedorFormProps {
  defaultValues?: Partial<ProveedorFormValues>
  onSubmit: (data: ProveedorFormValues) => Promise<void>
  isLoading?: boolean
}

export function ProveedorForm({ defaultValues, onSubmit, isLoading = false }: ProveedorFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProveedorFormValues>({
    resolver: zodResolver(proveedorSchema as never),
    defaultValues: {
      nombre: defaultValues?.nombre ?? '',
      ruc: defaultValues?.ruc ?? '',
      telefono: defaultValues?.telefono ?? '',
      email: defaultValues?.email ?? '',
      direccion: defaultValues?.direccion ?? '',
      es_activo: defaultValues?.es_activo ?? true,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          placeholder="Ej. Distribuidora Andina S.A."
          disabled={isLoading}
          aria-invalid={!!errors.nombre}
          {...register('nombre')}
        />
        {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="ruc">RUC</Label>
        <Input
          id="ruc"
          placeholder="Ej. 1790012345001"
          disabled={isLoading}
          aria-invalid={!!errors.ruc}
          {...register('ruc')}
        />
        {errors.ruc && <p className="text-xs text-destructive">{errors.ruc.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="telefono">
            Telefono <span className="text-xs text-muted-foreground">(opcional)</span>
          </Label>
          <Input
            id="telefono"
            placeholder="Ej. 0991234567"
            disabled={isLoading}
            aria-invalid={!!errors.telefono}
            {...register('telefono')}
          />
          {errors.telefono && <p className="text-xs text-destructive">{errors.telefono.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">
            Email <span className="text-xs text-muted-foreground">(opcional)</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Ej. contacto@proveedor.com"
            disabled={isLoading}
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="direccion">
          Direccion <span className="text-xs text-muted-foreground">(opcional)</span>
        </Label>
        <Input
          id="direccion"
          placeholder="Ej. Av. Amazonas y Naciones Unidas"
          disabled={isLoading}
          aria-invalid={!!errors.direccion}
          {...register('direccion')}
        />
        {errors.direccion && <p className="text-xs text-destructive">{errors.direccion.message}</p>}
      </div>

      <Controller
        control={control}
        name="es_activo"
        render={({ field }) => (
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label htmlFor="es_activo">Proveedor activo</Label>
              <p className="text-xs text-muted-foreground">
                Los proveedores inactivos no apareceran al crear nuevas ordenes de compra.
              </p>
            </div>
            <Switch
              id="es_activo"
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isLoading}
            />
          </div>
        )}
      />

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  )
}