// src/presentation/pages/admin/AdminAjustesInventarioPage.tsx
import { useEffect, useState } from 'react'
import { Loader2, ClipboardList, AlertCircle, Plus, Pencil } from 'lucide-react'

import { useAjusteInventarioStore } from '@/presentation/store/ajuste-inventario.store'
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
import AjusteInventarioDialog from '@/presentation/components/admin/AjusteInventarioDialog'
import EditAjusteDialog from '@/presentation/components/admin/EditAjusteDialog'
import { TIPO_AJUSTE_LABELS, type AjusteInventario } from '@/domain/entities/ajuste-inventario.entity'
import { TIPO_AJUSTE_COLORS, getCantidadColor, formatCantidadSigno } from '@/presentation/utils/ajuste-tipo-colors'

function formatFecha(isoString: string): string {
  return new Date(isoString).toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function AdminAjustesInventarioPage() {
  const { ajustes, isLoading, error, loadAjustes } = useAjusteInventarioStore()
  const { productos, loadProductos } = useProductoStore()

  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<AjusteInventario | null>(null)

  useEffect(() => {
    loadAjustes()
  }, [loadAjustes])

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
        <p className="text-sm text-muted-foreground">Cargando ajustes de inventario…</p>
      </div>
    )
  }

  if (error && ajustes.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground">Ocurrió un error</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </div>
        <Button variant="outline" onClick={loadAjustes}>
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Ajustes de Inventario</h1>
            <p className="text-sm text-muted-foreground">
              {ajustes.length} registro{ajustes.length !== 1 ? 's' : ''} (robo, daño, caducidad, error de conteo)
            </p>
          </div>
          <Button id="btn-nuevo-ajuste" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Nuevo Ajuste
          </Button>
        </div>

        {ajustes.length === 0 && (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ClipboardList className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No hay ajustes registrados.</p>
          </div>
        )}

        {ajustes.length > 0 && (
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-center">Cantidad</TableHead>
                  <TableHead>Justificativo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ajustes.map((ajuste) => {
                  const tipoStyle = TIPO_AJUSTE_COLORS[ajuste.tipo_ajuste]
                  return (
                    <TableRow key={ajuste.id}>
                      <TableCell className="font-medium text-foreground">
                        {getProductoNombre(ajuste.producto)}
                      </TableCell>
                      <TableCell>
                        <span
                          className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{ backgroundColor: tipoStyle.bg, color: tipoStyle.text }}
                        >
                          {TIPO_AJUSTE_LABELS[ajuste.tipo_ajuste]}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className="font-mono font-semibold"
                          style={{ color: getCantidadColor(ajuste.cantidad) }}
                        >
                          {formatCantidadSigno(ajuste.cantidad)}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[280px] truncate text-sm text-muted-foreground">
                        {ajuste.justificativo}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatFecha(ajuste.creado_en)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setEditTarget(ajuste)}
                          title="Editar clasificación/justificativo"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        {/* Sin botón de eliminar: bitácora legal, el ViewSet
                            no revierte el stock al borrar. */}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <AjusteInventarioDialog open={createOpen} onOpenChange={setCreateOpen} productos={productos} />

      {editTarget && (
        <EditAjusteDialog
          open={Boolean(editTarget)}
          onOpenChange={(open) => {
            if (!open) setEditTarget(null)
          }}
          ajuste={editTarget}
          productoNombre={getProductoNombre(editTarget.producto)}
        />
      )}
    </>
  )
}