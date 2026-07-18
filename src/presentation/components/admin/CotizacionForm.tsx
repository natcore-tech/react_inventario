import { useEffect } from 'react';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, Trash2 } from 'lucide-react';

import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Button } from '@/presentation/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';

const detalleSchema = z.object({
  producto: z.coerce.number({ message: 'Selecciona un producto' }).positive('Selecciona un producto'),
  cantidad: z.coerce
    .number({ message: 'Ingresa una cantidad válida' })
    .int('La cantidad debe ser un entero')
    .positive('La cantidad debe ser mayor a 0'),
  precio_propuesto: z.coerce
    .number({ message: 'Ingresa un precio válido' })
    .positive('El precio debe ser mayor a 0'),
});

const cotizacionSchema = z.object({
  proveedor: z.coerce.number({ message: 'Selecciona un proveedor' }).positive('Selecciona un proveedor'),
  codigo_cotizacion: z.string().min(2, 'Mínimo 2 caracteres').max(20, 'Máximo 20 caracteres'),
  fecha_validez: z.string().min(1, 'Selecciona una fecha de validez'),
  total_propuesto: z.coerce.number().min(0),
  detalles: z.array(detalleSchema).min(1, 'Debes agregar al menos un detalle de producto'),
});

export type CotizacionFormValues = z.infer<typeof cotizacionSchema>;

interface CotizacionFormProps {
  defaultValues?: Partial<CotizacionFormValues>;
  onSubmit: (data: CotizacionFormValues) => Promise<void>;
  isLoading?: boolean;
  proveedores: Array<{ id: number; nombre: string }>;
  productos: Array<{ id: number; nombre: string; precio?: number }>;
}

export function CotizacionForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  proveedores,
  productos,
}: CotizacionFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CotizacionFormValues>({
    resolver: zodResolver(cotizacionSchema as never),
    defaultValues: {
      proveedor: defaultValues?.proveedor ?? 0,
      codigo_cotizacion: defaultValues?.codigo_cotizacion ?? '',
      fecha_validez: defaultValues?.fecha_validez ?? '',
      total_propuesto: defaultValues?.total_propuesto ?? 0,
      detalles: defaultValues?.detalles ?? [{ producto: 0, cantidad: 1, precio_propuesto: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'detalles',
  });

  const watchDetalles = useWatch({
    control,
    name: 'detalles',
  });

  useEffect(() => {
    if (!watchDetalles) return;
    const total = watchDetalles.reduce((acc, current) => {
      const cantidad = Number(current?.cantidad) || 0;
      const precio = Number(current?.precio_propuesto) || 0;
      return acc + cantidad * precio;
    }, 0);
    setValue('total_propuesto', Math.round((total + Number.EPSILON) * 100) / 100);
  }, [watchDetalles, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                  {proveedores.map((prov) => (
                    <SelectItem key={prov.id} value={String(prov.id)}>
                      {prov.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.proveedor && <p className="text-xs text-destructive">{errors.proveedor.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="codigo_cotizacion">Código de Cotización</Label>
          <Input
            id="codigo_cotizacion"
            placeholder="Ej. COT-2026-001"
            disabled={isLoading}
            aria-invalid={!!errors.codigo_cotizacion}
            {...register('codigo_cotizacion')}
          />
          {errors.codigo_cotizacion && (
            <p className="text-xs text-destructive">{errors.codigo_cotizacion.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="fecha_validez">Fecha de Validez</Label>
          <Input
            id="fecha_validez"
            type="date"
            disabled={isLoading}
            aria-invalid={!!errors.fecha_validez}
            {...register('fecha_validez')}
          />
          {errors.fecha_validez && (
            <p className="text-xs text-destructive">{errors.fecha_validez.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-sm font-semibold tracking-tight">Detalles de Productos</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={() => append({ producto: 0, cantidad: 1, precio_propuesto: 0 })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar fila
          </Button>
        </div>

        {errors.detalles && !Array.isArray(errors.detalles) && (
          <p className="text-xs text-destructive font-medium">{errors.detalles.message}</p>
        )}

        <div className="space-y-3">
          {fields.map((field, index) => {
            const rowError = errors.detalles?.[index];

            return (
              <div key={field.id} className="flex flex-col gap-3 rounded-lg border p-3 bg-muted/20 sm:flex-row sm:items-end">
                <div className="flex-1 space-y-1">
                  <Label htmlFor={`detalles.${index}.producto`}>Producto</Label>
                  <Controller
                    control={control}
                    name={`detalles.${index}.producto`}
                    render={({ field: selectField }) => (
                      <Select
                        onValueChange={(value) => {
                          const prodId = Number(value);
                          selectField.onChange(prodId);
                          const prod = productos.find((p) => p.id === prodId);
                          if (prod && prod.precio) {
                            setValue(`detalles.${index}.precio_propuesto`, prod.precio);
                          }
                        }}
                        value={selectField.value ? String(selectField.value) : undefined}
                        disabled={isLoading}
                      >
                        <SelectTrigger id={`detalles.${index}.producto`} aria-invalid={!!rowError?.producto}>
                          <SelectValue placeholder="Selecciona un producto" />
                        </SelectTrigger>
                        <SelectContent>
                          {productos.map((prod) => (
                            <SelectItem key={prod.id} value={String(prod.id)}>
                              {prod.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {rowError?.producto && (
                    <p className="text-xs text-destructive">{rowError.producto.message}</p>
                  )}
                </div>

                <div className="w-full space-y-1 sm:w-28">
                  <Label htmlFor={`detalles.${index}.cantidad`}>Cantidad</Label>
                  <Input
                    id={`detalles.${index}.cantidad`}
                    type="number"
                    min="1"
                    step="1"
                    placeholder="1"
                    disabled={isLoading}
                    aria-invalid={!!rowError?.cantidad}
                    {...register(`detalles.${index}.cantidad`)}
                  />
                  {rowError?.cantidad && (
                    <p className="text-xs text-destructive">{rowError.cantidad.message}</p>
                  )}
                </div>

                <div className="w-full space-y-1 sm:w-36">
                  <Label htmlFor={`detalles.${index}.precio_propuesto`}>Precio Propuesto ($)</Label>
                  <Input
                    id={`detalles.${index}.precio_propuesto`}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    disabled={isLoading}
                    aria-invalid={!!rowError?.precio_propuesto}
                    {...register(`detalles.${index}.precio_propuesto`)}
                  />
                  {rowError?.precio_propuesto && (
                    <p className="text-xs text-destructive">{rowError.precio_propuesto.message}</p>
                  )}
                </div>

                <div className="w-full space-y-1 sm:w-28">
                  <Label>Subtotal ($)</Label>
                  <div className="flex h-10 w-full items-center justify-end rounded-md border bg-muted px-3 text-sm font-mono select-none">
                    {(
                      (Number(watchDetalles?.[index]?.cantidad) || 0) *
                      (Number(watchDetalles?.[index]?.precio_propuesto) || 0)
                    ).toFixed(2)}
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-destructive hover:bg-destructive/10 hover:text-destructive self-end sm:self-auto"
                  disabled={isLoading || fields.length <= 1}
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Eliminar</span>
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <div>
          <Label className="text-sm font-semibold">Total Propuesto General</Label>
          <p className="text-xs text-muted-foreground">Calculado automáticamente a partir de los subtotales.</p>
        </div>
        <Controller
          control={control}
          name="total_propuesto"
          render={({ field }) => (
            <div className="text-2xl font-bold font-mono tracking-tight text-primary">
              ${field.value.toFixed(2)}
            </div>
          )}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t">
        <Button type="submit" disabled={isLoading} className="px-6">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Guardando…' : 'Guardar Cotización'}
        </Button>
      </div>
    </form>
  );
}