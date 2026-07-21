// src/presentation/pages/admin/AdminAlertasStockPage.tsx
import { useEffect, useMemo, useState } from 'react'
import { Loader2, BellRing, AlertCircle, Plus, Pencil, Trash2 } from 'lucide-react'

import { useAlertaStockMinimoStore } from '@/presentation/store/alerta-stock-minimo.store'
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
import AlertaStockMinimoDialog from '@/presentation/components/admin/AlertaStockMinimoDialog'
import type { AlertaStockMinimo } from '@/domain/entities/alerta-stock-minimo.entity'
import { getAlertaEstado } from '@/presentation/utils/alerta-stock-colors'

export default function AdminAlertasStockPage() {
    const { alertas, isLoading, isSaving, error, loadAlertas, deleteAlerta } = useAlertaStockMinimoStore()
    const { productos, loadProductos } = useProductoStore()

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [selected, setSelected] = useState<AlertaStockMinimo | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<AlertaStockMinimo | null>(null)

    useEffect(() => {
        loadAlertas()
    }, [loadAlertas])

    useEffect(() => {
        if (productos.length === 0) loadProductos()
    }, [productos.length, loadProductos])

    function getProductoNombre(productoId: number): string {
        return productos.find((p) => p.id === productoId)?.nombre ?? `Producto #${productoId}`
    }

    function getProductoStock(productoId: number): number {
        return productos.find((p) => p.id === productoId)?.stock ?? 0
    }

    // Productos SIN alerta previa (respeta el OneToOne del backend), más el
    // propio producto si se está editando (para no perderlo del select).
    const productosDisponibles = useMemo(() => {
        const productosConAlerta = new Set(alertas.map((a) => a.producto))
        return productos.filter((p) => !productosConAlerta.has(p.id) || p.id === selected?.producto)
    }, [productos, alertas, selected])

    function handleNew() {
        setSelected(null)
        setIsFormOpen(true)
    }

    function handleEdit(alerta: AlertaStockMinimo) {
        setSelected(alerta)
        setIsFormOpen(true)
    }

    async function handleDeleteExecute() {
        if (!deleteTarget) return
        await deleteAlerta(deleteTarget.id)
        setDeleteTarget(null)
    }

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Cargando alertas de stock…</p>
            </div>
        )
    }

    if (error && alertas.length === 0) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <div className="text-center">
                    <p className="font-semibold text-foreground">Ocurrió un error</p>
                    <p className="mt-1 text-sm text-muted-foreground">{error}</p>
                </div>
                <Button variant="outline" onClick={loadAlertas}>
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
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Alertas de Stock Mínimo</h1>
                        <p className="text-sm text-muted-foreground">
                            {alertas.length} alerta{alertas.length !== 1 ? 's' : ''} configurada{alertas.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <Button id="btn-nueva-alerta" onClick={handleNew}>
                        <Plus className="h-4 w-4" />
                        Nueva Alerta
                    </Button>
                </div>

                {alertas.length === 0 && (
                    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <BellRing className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">No hay alertas de stock configuradas.</p>
                    </div>
                )}

                {alertas.length > 0 && (
                    <div className="rounded-md border border-border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Producto</TableHead>
                                    <TableHead className="text-center">Stock actual</TableHead>
                                    <TableHead className="text-center">Mínimo</TableHead>
                                    <TableHead className="text-center">Estado</TableHead>
                                    <TableHead>Correo de notificación</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {alertas.map((alerta) => {
                                    const stockActual = getProductoStock(alerta.producto)
                                    const estado = getAlertaEstado(stockActual, alerta.cantidad_minima, alerta.activa)
                                    return (
                                        <TableRow key={alerta.id}>
                                            <TableCell className="font-medium text-foreground">
                                                {getProductoNombre(alerta.producto)}
                                            </TableCell>
                                            <TableCell className="text-center font-mono text-sm">{stockActual}</TableCell>
                                            <TableCell className="text-center font-mono text-sm text-muted-foreground">
                                                {alerta.cantidad_minima}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span
                                                    className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                                                    style={{ backgroundColor: estado.bg, color: estado.text }}
                                                >
                                                    {estado.label}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{alerta.email_notificacion}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(alerta)} title="Editar">
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        onClick={() => setDeleteTarget(alerta)}
                                                        title="Eliminar"
                                                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            <AlertaStockMinimoDialog
                open={isFormOpen}
                onOpenChange={(open) => {
                    setIsFormOpen(open)
                    if (!open) setSelected(null)
                }}
                productosDisponibles={productosDisponibles}
                alerta={selected}
            />

            <AlertDialog
                open={deleteTarget !== null}
                onOpenChange={(open) => {
                    if (!open) setDeleteTarget(null)
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar alerta de stock?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Se eliminará la alerta configurada para{' '}
                            <span className="font-semibold text-foreground">
                                {deleteTarget ? getProductoNombre(deleteTarget.producto) : ''}
                            </span>
                            . Esta acción no se puede deshacer.
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
        </AlertDialog >
    </>
  )
}