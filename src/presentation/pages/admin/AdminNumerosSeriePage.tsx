// src/presentation/pages/admin/AdminNumerosSeriePage.tsx
import { useEffect, useState } from 'react'
import { Loader2, Barcode, AlertCircle, Plus, Pencil, Trash2 } from 'lucide-react'

import { useNumeroSerieStore } from '@/presentation/store/numero-serie.store'
import { useProductoStore } from '@/presentation/store/producto.store'
import type { NumeroSerie } from '@/domain/entities/numero-serie.entity'
import { ESTADO_NUMERO_SERIE_LABELS } from '@/domain/entities/numero-serie.entity'
import NumeroSerieDialog from '@/presentation/components/admin/NumeroSerieDialog'
import { Button } from '@/presentation/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/presentation/components/ui/alert-dialog'

function formatFecha(isoString: string): string {
  return new Date(isoString).toLocaleDateString('es-EC', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// Clasificación visual del estado, coherente con la paleta del proyecto
// (success/warning/destructive en presentation/theme/colors.ts).
function getEstadoBadgeClasses(estado: NumeroSerie['estado']): string {
  switch (estado) {
    case 'DISPONIBLE':
      return 'bg-primary/10 text-primary'
    case 'VENDIDO':
      return 'bg-muted text-muted-foreground'
    case 'DANO':
      return 'bg-destructive/10 text-destructive'
  }
}

export default function AdminNumerosSeriePage() {
  const { numerosSerie, isLoading, isSaving, error, loadNumerosSerie, deleteNumeroSerie } =
    useNumeroSerieStore()
  const { productos, loadProductos } = useProductoStore()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selected, setSelected] = useState<NumeroSerie | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<NumeroSerie | null>(null)

  useEffect(() => {
    loadNumerosSerie()
  }, [loadNumerosSerie])

  useEffect(() => {
    if (productos.length === 0) loadProductos()
  }, [productos.length, loadProductos])

  function getProductoNombre(productoId: number): string {
    return productos.find((p) => p.id === productoId)?.nombre ?? `Producto #${productoId}`
  }

  function handleNew() {
    setSelected(null)
    setIsFormOpen(true)
  }

  function handleEdit(item: NumeroSerie) {
    setSelected(item)
    setIsFormOpen(true)
  }

  async function handleDeleteExecute() {
    if (!deleteTarget) return
    await deleteNumeroSerie(deleteTarget.id)
    setDeleteTarget(null)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Cargando números de serie…</p>
      </div>
    )
  }

  if (error && numerosSerie.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground">Ocurrió un error</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </div>
        <Button variant="outline" onClick={loadNumerosSerie}>
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Números de Serie</h1>
            <p className="text-sm text-muted-foreground">
              {numerosSerie.length} registro{numerosSerie.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button id="btn-nuevo-numero-serie" onClick={handleNew}>
            <Plus className="h-4 w-4" />
            Nuevo Registro
          </Button>
        </div>

        {numerosSerie.length === 0 && (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Barcode className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No hay números de serie registrados.</p>
          </div>
        )}

        {numerosSerie.length > 0 && (
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Número de serie</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead>Fecha de ingreso</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {numerosSerie.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-foreground">
                      {getProductoNombre(item.producto)}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {item.codigo_serial}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getEstadoBadgeClasses(item.estado)}`}
                      >
                        {ESTADO_NUMERO_SERIE_LABELS[item.estado]}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatFecha(item.fecha_ingreso)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleEdit(item)}
                          disabled={isSaving}
                          title="Editar"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteTarget(item)}
                          disabled={isSaving}
                          title="Eliminar"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <NumeroSerieDialog
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open)
          if (!open) setSelected(null)
        }}
        productos={productos}
        numeroSerie={selected}
      />

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar número de serie?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de eliminar{' '}
              <span className="font-semibold text-foreground">{deleteTarget?.codigo_serial}</span>.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDeleteExecute} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Eliminando…
                </>
              ) : (
                'Sí, eliminar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}