import { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog';
import { useCotizacionStore } from '../../store/cotizacion.store';
import type { Cotizacion } from '../../../domain/entities/cotizacion.entity';
import { CotizacionForm, type CotizacionFormValues } from './CotizacionForm';

interface CotizacionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cotizacion?: Cotizacion;
  proveedores: Array<{ id: number; nombre: string }>;
  productos: Array<{ id: number; nombre: string; precio?: number }>;
}

export function CotizacionDialog({
  open,
  onOpenChange,
  cotizacion,
  proveedores,
  productos,
}: CotizacionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const createCotizacion = useCotizacionStore((s) => s.createCotizacion);
  const updateCotizacion = useCotizacionStore((s) => s.updateCotizacion);

  const isEditing = Boolean(cotizacion);
  const title = isEditing ? 'Editar Cotización' : 'Nueva Cotización';

  async function handleSubmit(data: CotizacionFormValues) {
    setIsLoading(true);
    try {
      if (isEditing && cotizacion?.id) {
        await updateCotizacion(cotizacion.id, data);
        toast.success('Cotización actualizada', {
          description: `La cotización "${data.codigo_cotizacion}" fue actualizada con éxito.`,
        });
      } else {
        await createCotizacion(data);
        toast.success('Cotización creada', {
          description: `La cotización "${data.codigo_cotizacion}" fue registrada con éxito.`,
        });
      }
      onOpenChange(false);
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        (isEditing ? 'No se pudo actualizar la cotización.' : 'No se pudo crear la cotización.');
      toast.error('Error', { description: message });
    } finally {
      setIsLoading(false);
    }
  }

  const defaultValues: Partial<CotizacionFormValues> | undefined = cotizacion
    ? {
        proveedor: cotizacion.proveedor,
        codigo_cotizacion: cotizacion.codigo_cotizacion,
        fecha_validez: cotizacion.fecha_validez,
        total_propuesto: Number(cotizacion.total_propuesto),
        detalles: cotizacion.detalles.map((d) => ({
          producto: d.producto,
          cantidad: d.cantidad,
          precio_propuesto: Number(d.precio_propuesto),
        })),
      }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <CotizacionForm
          key={cotizacion?.id ?? 'new'}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          proveedores={proveedores}
          productos={productos}
        />
      </DialogContent>
    </Dialog>
  );
}