// Ruta: src/presentation/pages/admin/OrdenesCompraPage.tsx

import { useEffect, useState } from 'react'
import { Plus, Search, Eye, RefreshCcw, ClipboardList } from 'lucide-react'

import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../components/ui/table'
import { useComprasStore } from '../../store/compras.store'
import type { OrdenCompra } from '../../../domain/entities/orden-compra.entity'
import { OrdenCompraDialog } from '../../components/admin/OrdenCompraDialog'
import { OrdenDetalleDialog } from '../../components/admin/OrdenDetalleDialog'
import { CambiarEstadoOrdenDialog } from '../../components/admin/CambiarEstadoOrdenDialog'

// Mapea cada estado a una variante de Badge (usa las que ya trae shadcn: no
// se agrego "success" para no depender de tocar el Badge base).
function estadoBadgeVariant(estado: OrdenCompra['estado']): 'default' | 'secondary' | 'destructive' {
    if (estado === 'RECIBIDA') return 'default'
    if (estado === 'CANCELADA') return 'destructive'
    return 'secondary' // PENDIENTE
}

export default function OrdenesCompraPage() {
    const ordenesCompra = useComprasStore((s) => s.ordenesCompra)
    const isLoadingOrdenesCompra = useComprasStore((s) => s.isLoadingOrdenesCompra)
    const ordenesCompraError = useComprasStore((s) => s.ordenesCompraError)
    const fetchOrdenesCompra = useComprasStore((s) => s.fetchOrdenesCompra)
    const proveedores = useComprasStore((s) => s.proveedores)
    const fetchProveedores = useComprasStore((s) => s.fetchProveedores)

    const [search, setSearch] = useState('')
    const [createOpen, setCreateOpen] = useState(false)
    const [detalleTarget, setDetalleTarget] = useState<OrdenCompra | null>(null)
    const [estadoTarget, setEstadoTarget] = useState<OrdenCompra | null>(null)

    useEffect(() => {
        fetchOrdenesCompra()
        // Las ordenes necesitan la lista de proveedores para el <select> del form.
        if (proveedores.length === 0) fetchProveedores()
    }, [fetchOrdenesCompra, fetchProveedores, proveedores.length])

    const filtradas = ordenesCompra.filter(
        (o) =>
            (o.codigo_orden ?? '').toLowerCase().includes(search.toLowerCase()) ||
            (o.proveedor_nombre ?? '').toLowerCase().includes(search.toLowerCase()),
    )

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Órdenes de Compra</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Gestiona las órdenes de compra a proveedores.
                    </p>
                </div>
                <Button onClick={() => setCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva orden
                </Button>
            </div>

            <div className="relative mb-4 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    className="pl-9"
                    placeholder="Buscar por codigo o proveedor..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {ordenesCompraError && (
                <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {ordenesCompraError}
                </div>
            )}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Codigo</TableHead>
                            <TableHead>Proveedor</TableHead>
                            <TableHead className="text-center">Items</TableHead>
                            <TableHead className="text-right">Total estimado</TableHead>
                            <TableHead className="text-center">Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoadingOrdenesCompra &&
                            Array.from({ length: 6 }).map((_, i) => (
                                <TableRow key={`skeleton-${i}`}>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell className="text-center"><Skeleton className="mx-auto h-4 w-8" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-20" /></TableCell>
                                    <TableCell className="text-center"><Skeleton className="mx-auto h-5 w-20" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="ml-auto h-8 w-20" /></TableCell>
                                </TableRow>
                            ))}

                        {!isLoadingOrdenesCompra && filtradas.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="py-12 text-center">
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <ClipboardList className="h-10 w-10" />
                                        <p className="text-sm font-medium">
                                            {search ? `Sin resultados para "${search}"` : 'No hay ordenes de compra registradas'}
                                        </p>
                                        {!search && (
                                            <Button variant="outline" size="sm" onClick={() => setCreateOpen(true)}>
                                                <Plus className="mr-2 h-3 w-3" />
                                                Crear primera orden
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}

                        {!isLoadingOrdenesCompra &&
                            filtradas.map((orden) => (
                                <TableRow key={orden.id}>
                                    <TableCell className="font-medium">{orden.codigo_orden}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{orden.proveedor_nombre}</TableCell>
                                    <TableCell className="text-center text-sm text-muted-foreground">
                                        {orden.detalles.length}
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-sm">
                                        ${Number(orden.total_estimado).toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={estadoBadgeVariant(orden.estado)}>{orden.estado_display}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => setDetalleTarget(orden)}
                                                title="Ver detalle"
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span className="sr-only">Ver detalle</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => setEstadoTarget(orden)}
                                                title="Cambiar estado"
                                                disabled={orden.estado !== 'PENDIENTE'}
                                            >
                                                <RefreshCcw className="h-4 w-4" />
                                                <span className="sr-only">Cambiar estado</span>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>

            <OrdenCompraDialog open={createOpen} onOpenChange={setCreateOpen} />

            {detalleTarget && (
                <OrdenDetalleDialog
                    open={Boolean(detalleTarget)}
                    onOpenChange={(open) => {
                        if (!open) setDetalleTarget(null)
                    }}
                    orden={detalleTarget}
                />
            )}

            {estadoTarget && (
                <CambiarEstadoOrdenDialog
                    open={Boolean(estadoTarget)}
                    onOpenChange={(open) => {
                        if (!open) setEstadoTarget(null)
                    }}
                    orden={estadoTarget}
                />
            )}
        </div>
    )
}