// src/presentation/pages/admin/AdminDevolucionesPage.tsx
import { useEffect, useState } from 'react'
import { Loader2, RotateCcw, AlertCircle, Plus, Pencil } from 'lucide-react'

import { useDevolucionClienteStore } from '@/presentation/store/devolucion-cliente.store'
import { useProductoStore } from '@/presentation/store/producto.store'
import { Button } from '@/presentation/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table'
import DevolucionClienteDialog from '@/presentation/components/admin/DevolucionClienteDialog'
import EditDevolucionDialog from '@/presentation/components/admin/EditDevolucionDialog'
import {
  ESTADO_PRODUCTO_DEVOLUCION_LABELS,
  type DevolucionCliente,
} from '@/domain/entities/devolucion-cliente.entity'
import { ESTADO_DEVOLUCION_COLORS } from '@/presentation/utils/devolucion-estado-colors'

function formatFecha(isoString: string): string {
  return new Date(isoString).toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function AdminDevolucionesPage() {
  const { devoluciones, isLoading, error, loadDevoluciones } = useDevolucionClienteStore()
  const { productos, loadProductos } = useProductoStore()

  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<DevolucionCliente | null>(null)

  useEffect(() => {
    loadDevoluciones()
  }, [loadDevoluciones])

  useEffect(() => {
    if (productos.length === 0) loadProductos()
  }, [productos.length, loadProductos])

  function getProductoNombre(productoId: number): string {
    return productos.find((p) => p.id === productoId)?.nombre ?? `Producto #${productoId}`
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Cargando devoluciones…</p>
      </div>
    )
  }

  if (error && devoluciones.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground">Ocurrió un error</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </div>
        <Button variant="outline" onClick={loadDevoluciones}>
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Devoluciones de Clientes</h1>
            <p className="text-sm text-muted-foreground">
              {devoluciones.length} registro{devoluciones.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button id="btn-nueva-devolucion" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Nueva Devolución
          </Button>
        </div>

        {devoluciones.length === 0 && (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <RotateCcw className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No hay devoluciones registradas.</p>
          </div>
        )}

        {devoluciones.length > 0 && (
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-center">Cantidad</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devoluciones.map((dev) => {
                  const estadoStyle = ESTADO_DEVOLUCION_COLORS[dev.estado_producto]
                  return (
                    <TableRow key={dev.id}>
                      <TableCell className="font-medium text-foreground">
                        {getProductoNombre(dev.producto)}
                      </TableCell>
                      <TableCell className="text-center font-mono text-sm">{dev.cantidad}</TableCell>
                      <TableCell className="text-center">
                        <span
                          className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{ backgroundColor: estadoStyle.bg, color: estadoStyle.text }}
                        >
                          {ESTADO_PRODUCTO_DEVOLUCION_LABELS[dev.estado_producto]}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[280px] truncate text-sm text-muted-foreground">
                        {dev.motivo}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatFecha(dev.fecha_devolucion)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setEditTarget(dev)}
                          title="Editar motivo"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        {/* Sin botón de eliminar: registro histórico, el
                            reingreso de stock (si aplicó) no se revierte. */}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <DevolucionClienteDialog open={createOpen} onOpenChange={setCreateOpen} productos={productos} />

      {editTarget && (
        <EditDevolucionDialog
          open={Boolean(editTarget)}
          onOpenChange={(open) => {
            if (!open) setEditTarget(null)
          }}
          devolucion={editTarget}
          productoNombre={getProductoNombre(editTarget.producto)}
        />
      )}
    </>
  )
}