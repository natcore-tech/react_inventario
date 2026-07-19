// src/presentation/pages/warehouse/TrasladoBodegaDetallePage.tsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTrasladoBodegaStore } from '@/presentation/store/traslado-bodega.store'
import {
  ArrowLeft,
  ArrowRightLeft,
  RefreshCw,
  AlertCircle,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Hash,
  CalendarDays,
  Warehouse,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react'
import type { TrasladoBodega } from '@/domain/entities/traslado-bodega.entity'
import { Button } from '@/presentation/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/presentation/components/ui/dialog'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'

// ── Badge de estado ──────────────────────────────────────────────────────────
const estadoBadge: Record<
  'EN_TRANSITO' | 'COMPLETADO' | 'CANCELADO',
  { label: string; className: string; icon: React.ReactNode }
> = {
  EN_TRANSITO: {
    label: 'En Tránsito',
    className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: <Clock className="h-4 w-4" />,
  },
  COMPLETADO: {
    label: 'Completado',
    className: 'bg-green-100 text-green-700 border-green-200',
    icon: <CheckCircle className="h-4 w-4" />,
  },
  CANCELADO: {
    label: 'Cancelado',
    className: 'bg-red-100 text-red-700 border-red-200',
    icon: <XCircle className="h-4 w-4" />,
  },
}

export default function TrasladoBodegaDetallePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { traslados, loading, error, fetchTraslados, createTrasladoBodegaDetalle, updateTrasladoBodegaDetalle, deleteTrasladoBodegaDetalle } = useTrasladoBodegaStore()
  const [traslado, setTraslado] = useState<TrasladoBodega | null>(null)
  
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingDetalle, setEditingDetalle] = useState<any>(null)
  const [formData, setFormData] = useState({ producto: 0, cantidad: 0 })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!traslado) return
    await createTrasladoBodegaDetalle(traslado.id, formData)
    setIsCreateOpen(false)
    setFormData({ producto: 0, cantidad: 0 })
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!traslado || !editingDetalle) return
    await updateTrasladoBodegaDetalle(traslado.id, editingDetalle.id, formData)
    setIsEditOpen(false)
    setEditingDetalle(null)
  }

  const handleDelete = async (detalleId: number) => {
    if (!traslado) return
    if (confirm('¿Estás seguro de eliminar este ítem del traslado?')) {
      await deleteTrasladoBodegaDetalle(traslado.id, detalleId)
    }
  }

  const openEdit = (detalle: any) => {
    setEditingDetalle(detalle)
    setFormData({ producto: detalle.producto, cantidad: detalle.cantidad })
    setIsEditOpen(true)
  }

  useEffect(() => {
    if (traslados.length === 0) {
      fetchTraslados()
    }
  }, [fetchTraslados, traslados.length])

  useEffect(() => {
    if (traslados.length > 0 && id) {
      const found = traslados.find((t) => t.id === Number(id))
      setTraslado(found ?? null)
    }
  }, [traslados, id])

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-40 animate-pulse rounded-lg border bg-muted" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg border bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  // ── No encontrado ────────────────────────────────────────────────────────
  if (!traslado) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-20 text-center">
        <ArrowRightLeft className="h-12 w-12 text-muted-foreground/40" />
        <div>
          <p className="font-medium">Traslado no encontrado</p>
          <p className="text-sm text-muted-foreground">
            El traslado #{id} no existe o no fue cargado.
          </p>
        </div>
        <button
          onClick={() => navigate('/warehouse/transfers')}
          className="flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Traslados
        </button>
      </div>
    )
  }

  const badge = estadoBadge[traslado.estado]

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb / Header ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/warehouse/transfers"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Traslados
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ArrowRightLeft className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Traslado #{traslado.id}
              </h1>
              <p className="text-sm text-muted-foreground">
                Detalle completo del traslado entre bodegas
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => fetchTraslados()}
          className="flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
        >
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </button>
      </div>

      {/* ── Tarjeta de información del traslado ─────────────────────────── */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold">Información del Traslado</h2>
        </div>
        <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* ID */}
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Hash className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">ID del Traslado</p>
              <p className="font-semibold">#{traslado.id}</p>
            </div>
          </div>

          {/* Estado */}
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              {badge.icon}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Estado</p>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-sm font-medium ${badge.className}`}
              >
                {badge.icon}
                {badge.label}
              </span>
            </div>
          </div>

          {/* Fecha */}
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Fecha del Traslado</p>
              <p className="font-semibold text-sm">
                {new Date(traslado.fecha_traslado).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Package className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ítems Trasladados</p>
              <p className="font-semibold">{traslado.detalles.length} ítem(s)</p>
            </div>
          </div>
        </div>

        {/* Bodegas origen / destino */}
        <div className="border-t px-6 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3 flex-1 min-w-[200px]">
              <Warehouse className="h-5 w-5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Bodega Origen</p>
                <p className="font-semibold">{traslado.bodega_origen_nombre}</p>
                <p className="text-xs text-muted-foreground">ID: {traslado.bodega_origen}</p>
              </div>
            </div>
            <ArrowRightLeft className="h-6 w-6 text-primary shrink-0" />
            <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3 flex-1 min-w-[200px]">
              <Warehouse className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Bodega Destino</p>
                <p className="font-semibold">{traslado.bodega_destino_nombre}</p>
                <p className="text-xs text-muted-foreground">ID: {traslado.bodega_destino}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabla de detalles ────────────────────────────────────────────── */}
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold">Líneas de Detalle</h2>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
              {traslado.detalles.length} ítem(s)
            </span>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Agregar Ítem
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Detalle</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="producto">ID Producto</Label>
                  <Input type="number" id="producto" value={formData.producto || ''} onChange={(e) => setFormData({ ...formData, producto: Number(e.target.value) })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cantidad">Cantidad</Label>
                  <Input type="number" id="cantidad" value={formData.cantidad || ''} onChange={(e) => setFormData({ ...formData, cantidad: Number(e.target.value) })} required />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                  <Button type="submit" disabled={loading}>Guardar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {traslado.detalles.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Package className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Sin líneas de detalle registradas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">#</th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">ID Detalle</th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">ID Producto</th>
                  <th className="px-6 py-3 text-right font-medium text-muted-foreground">Cantidad</th>
                  <th className="px-6 py-3 text-right font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {traslado.detalles.map((detalle, index) => (
                  <tr
                    key={detalle.id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <td className="px-6 py-3 text-muted-foreground">{index + 1}</td>
                    <td className="px-6 py-3 font-mono text-xs text-muted-foreground">
                      {detalle.id}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Producto #{detalle.producto}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span className="font-semibold text-primary">{detalle.cantidad}</span>
                    </td>
                    <td className="px-6 py-3 text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(detalle)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(detalle.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Detalle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-producto">ID Producto</Label>
              <Input type="number" id="edit-producto" value={formData.producto || ''} onChange={(e) => setFormData({ ...formData, producto: Number(e.target.value) })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-cantidad">Cantidad</Label>
              <Input type="number" id="edit-cantidad" value={formData.cantidad || ''} onChange={(e) => setFormData({ ...formData, cantidad: Number(e.target.value) })} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading}>Guardar Cambios</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
