// Ruta: src/presentation/components/admin/OrdenCompraForm.tsx

import { useEffect, useMemo, useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Plus, Trash2 } from 'lucide-react'

import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { getProductosResumen } from '../../../infrastructure/adapters/axios-producto-resumen.repository'
import type { ProductoResumen } from '../../../domain/entities/producto-resumen.entity'
import type { Proveedor } from '../../../domain/entities/proveedor.entity'

// ─── Schema de validacion ───────────────────────────────────────────────────

const detalleSchema = z.object({
  producto: z.coerce.number({ message: 'Selecciona un producto' }).positive('Selecciona un producto'),
  cantidad: z.coerce
    .number({ message: 'Cantidad invalida' })
    .int('Debe ser un numero entero')
    .positive('Debe ser mayor a 0'),
  precio_unitario_compra: z.coerce
    .number({ message: 'Precio invalido' })
    .positive('El precio debe ser mayor a 0'),
})

const ordenCompraSchema = z.object({
  codigo_orden: z.string().min(1, 'El codigo es obligatorio').max(20, 'Maximo 20 caracteres'),
  proveedor: z.coerce.number({ message: 'Selecciona un proveedor' }).positive('Selecciona un proveedor'),
  detalles: z.array(detalleSchema).min(1, 'Agrega al menos un producto'),
})

export type OrdenCompraFormValues = z.infer<typeof ordenCompraSchema>

interface OrdenCompraFormProps {
  proveedores: Proveedor[]
  onSubmit: (data: OrdenCompraFormValues) => Promise<void>
  isLoading?: boolean
}

export function OrdenCompraForm({ proveedores, onSubmit, isLoading = false }: OrdenCompraFormProps) {
  const [productos, setProductos] = useState<ProductoResumen[]>([])
  const [isLoadingProductos, setIsLoadingProductos] = useState(true)

  useEffect(() => {
    getProductosResumen()
      .then(setProductos)
      .catch(() => setProductos([]))
      .finally(() => setIsLoadingProductos(false))
  }, [])

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<OrdenCompraFormValues>({
    resolver: zodResolver(ordenCompraSchema as never),
    defaultValues: {
      codigo_orden: '',
      proveedor: undefined,
      detalles: [{ producto: undefined, cantidad: 1, precio_unitario_compra: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'detalles' })

  const detallesActuales = watch('detalles')
  const totalEstimado = useMemo(() => {
    return detallesActuales.reduce((acumulado, item) => {
      const cantidad = Number(item?.cantidad) || 0
      const precio = Number(item?.precio_unitario_compra) || 0
      return acumulado + cantidad * precio
    }, 0)
  }, [detallesActuales])

  const proveedoresActivos = proveedores.filter((p) => p.es_activo)

  function handleProductoChange(index: number, productoId: number, onChange: (value: number) => void) {
    onChange(productoId)
    // Autocompleta el precio de compra sugerido con el precio de venta del
    // producto, pero queda editable por si el precio de compra es distinto.
    const producto = productos.find((p) => p.id === productoId)
    if (producto) {
      const precioInput = document.getElementById(`precio-${index}`) as HTMLInputElement | null
      if (precioInput && !precioInput.value) {
        precioInput.value = producto.precio
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="codigo_orden">Codigo de orden</Label>
          <Input
            id="codigo_orden"
            placeholder="Ej. OC-2026-001"
            disabled={isLoading}
            aria-invalid={!!errors.codigo_orden}
            {...register('codigo_orden')}
          />
          {errors.codigo_orden && (
            <p className="text-xs text-destructive">{errors.codigo_orden.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="proveedor">Proveedor</Label>
          <Controller
            control={control}
            name="proveedor"
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value ? String(field.value) : undefined}
                disabled={isLoading}
              >
                <SelectTrigger id="proveedor" aria-invalid={!!errors.proveedor}>
                  <SelectValue placeholder="Selecciona un proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {proveedoresActivos.map((proveedor) => (
                    <SelectItem key={proveedor.id} value={String(proveedor.id)}>
                      {proveedor.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.proveedor && <p className="text-xs text-destructive">{errors.proveedor.message}</p>}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label>Productos</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLoading || isLoadingProductos}
            onClick={() => append({ producto: undefined as never, cantidad: 1, precio_unitario_compra: 0 })}
          >
            <Plus className="mr-1 h-3 w-3" />
            Agregar producto
          </Button>
        </div>

        {errors.detalles?.root && (
          <p className="mb-2 text-xs text-destructive">{errors.detalles.root.message}</p>
        )}
        {errors.detalles?.message && (
          <p className="mb-2 text-xs text-destructive">{errors.detalles.message}</p>
        )}

        <div className="space-y-3">
          {fields.map((item, index) => (
            <div key={item.id} className="grid grid-cols-[1fr_auto_auto_auto] items-start gap-2 rounded-lg border p-3">
              <div className="space-y-1">
                <Controller
                  control={control}
                  name={`detalles.${index}.producto`}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => handleProductoChange(index, Number(value), field.onChange)}
                      value={field.value ? String(field.value) : undefined}
                      disabled={isLoading || isLoadingProductos}
                    >
                      <SelectTrigger aria-invalid={!!errors.detalles?.[index]?.producto}>
                        <SelectValue placeholder={isLoadingProductos ? 'Cargando...' : 'Selecciona un producto'} />
                      </SelectTrigger>
                      <SelectContent>
                        {productos.map((producto) => (
                          <SelectItem key={producto.id} value={String(producto.id)}>
                            {producto.nombre} (stock: {producto.stock})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.detalles?.[index]?.producto && (
                  <p className="text-xs text-destructive">{errors.detalles[index]?.producto?.message}</p>
                )}
              </div>

              <div className="w-24 space-y-1">
                <Input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Cant."
                  disabled={isLoading}
                  aria-invalid={!!errors.detalles?.[index]?.cantidad}
                  {...register(`detalles.${index}.cantidad`)}
                />
                {errors.detalles?.[index]?.cantidad && (
                  <p className="text-xs text-destructive">{errors.detalles[index]?.cantidad?.message}</p>
                )}
              </div>

              <div className="w-28 space-y-1">
                <Input
                  id={`precio-${index}`}
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Precio"
                  disabled={isLoading}
                  aria-invalid={!!errors.detalles?.[index]?.precio_unitario_compra}
                  {...register(`detalles.${index}.precio_unitario_compra`)}
                />
                {errors.detalles?.[index]?.precio_unitario_compra && (
                  <p className="text-xs text-destructive">
                    {errors.detalles[index]?.precio_unitario_compra?.message}
                  </p>
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isLoading || fields.length === 1}
                onClick={() => remove(index)}
                title="Quitar producto"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
        <span className="text-sm text-muted-foreground">Total estimado</span>
        <span className="font-mono text-lg font-semibold">${totalEstimado.toFixed(2)}</span>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isLoading}>
          <Loader2 className={`mr-2 h-4 w-4 animate-spin ${isLoading ? '' : 'hidden'}`} />
          {isLoading ? 'Guardando...' : 'Crear orden'}
        </Button>
      </div>
    </form>
  )
}