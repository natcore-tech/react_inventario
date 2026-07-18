// Ruta: src/presentation/components/admin/OrdenDetalleDialog.tsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import type { OrdenCompra } from '../../../domain/entities/orden-compra.entity'

interface OrdenDetalleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orden: OrdenCompra
}

export function OrdenDetalleDialog({ open, onOpenChange, orden }: OrdenDetalleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{orden.codigo_orden}</DialogTitle>
          <DialogDescription>
            Proveedor: {orden.proveedor_nombre} · Estado: {orden.estado_display}
          </DialogDescription>
        </DialogHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead className="text-center">Cantidad</TableHead>
              <TableHead className="text-right">Precio unitario</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orden.detalles.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.producto_nombre}</TableCell>
                <TableCell className="text-center">{item.cantidad}</TableCell>
                <TableCell className="text-right font-mono">
                  ${Number(item.precio_unitario_compra).toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  ${(item.cantidad * Number(item.precio_unitario_compra)).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between border-t pt-3">
          <span className="text-sm text-muted-foreground">Total estimado</span>
          <span className="font-mono text-lg font-semibold">
            ${Number(orden.total_estimado).toFixed(2)}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}