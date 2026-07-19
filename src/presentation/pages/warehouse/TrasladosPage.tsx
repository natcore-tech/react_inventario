// src/presentation/pages/warehouse/TrasladosPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrasladoBodegaStore } from '@/presentation/store/traslado-bodega.store'
import { ArrowRightLeft, RefreshCw, AlertCircle, Clock, CheckCircle, XCircle, ChevronRight, Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/presentation/components/ui/dialog'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select'

const estadoBadge: Record<
  'EN_TRANSITO' | 'COMPLETADO' | 'CANCELADO',
  { label: string; className: string; icon: React.ReactNode }
> = {
  EN_TRANSITO: {
    label: 'En Tránsito',
    className: 'bg-yellow-100 text-yellow-700',
    icon: <Clock className="h-3 w-3" />,
  },
  COMPLETADO: {
    label: 'Completado',
    className: 'bg-green-100 text-green-700',
    icon: <CheckCircle className="h-3 w-3" />,
  },
  CANCELADO: {
    label: 'Cancelado',
    className: 'bg-red-100 text-red-700',
    icon: <XCircle className="h-3 w-3" />,
  },
}

export default function TrasladosPage() {
  const navigate = useNavigate()
  const { traslados, loading, error, fetchTraslados, createTrasladoBodega, updateTrasladoBodega, deleteTrasladoBodega } = useTrasladoBodegaStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingTraslado, setEditingTraslado] = useState<any>(null)
  
  const [formData, setFormData] = useState<{ bodega_origen: number, bodega_destino: number, estado: 'EN_TRANSITO' | 'COMPLETADO' | 'CANCELADO' }>({ bodega_origen: 0, bodega_destino: 0, estado: 'EN_TRANSITO' })

  useEffect(() => {
    fetchTraslados()
  }, [fetchTraslados])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await createTrasladoBodega({ ...formData, detalles: [] })
    setIsCreateOpen(false)
    setFormData({ bodega_origen: 0, bodega_destino: 0, estado: 'EN_TRANSITO' })
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTraslado) return
    await updateTrasladoBodega(editingTraslado.id, formData)
    setIsEditOpen(false)
    setEditingTraslado(null)
  }

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    if (confirm('¿Estás seguro de eliminar este traslado?')) {
      await deleteTrasladoBodega(id)
    }
  }

  const openEdit = (e: React.MouseEvent, traslado: any) => {
    e.stopPropagation()
    setEditingTraslado(traslado)
    setFormData({ bodega_origen: traslado.bodega_origen, bodega_destino: traslado.bodega_destino, estado: traslado.estado })
    setIsEditOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Traslados entre Bodegas</h1>
            <p className="text-sm text-muted-foreground">
              Historial de movimientos de mercancía entre bodegas
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Traslado
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Traslado</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="origen">ID Bodega Origen</Label>
                  <Input type="number" id="origen" value={formData.bodega_origen || ''} onChange={(e) => setFormData({ ...formData, bodega_origen: Number(e.target.value) })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destino">ID Bodega Destino</Label>
                  <Input type="number" id="destino" value={formData.bodega_destino || ''} onChange={(e) => setFormData({ ...formData, bodega_destino: Number(e.target.value) })} required />
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select value={formData.estado} onValueChange={(val: any) => setFormData({ ...formData, estado: val })}>
                    <SelectTrigger><SelectValue placeholder="Seleccione estado" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EN_TRANSITO">En Tránsito</SelectItem>
                      <SelectItem value="COMPLETADO">Completado</SelectItem>
                      <SelectItem value="CANCELADO">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                  <Button type="submit" disabled={loading}>Guardar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Button
            onClick={() => fetchTraslados()}
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Stats */}
      {!loading && traslados.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Total Traslados</p>
            <p className="mt-1 text-3xl font-bold">{traslados.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">En Tránsito</p>
            <p className="mt-1 text-3xl font-bold text-yellow-600">
              {traslados.filter((t) => t.estado === 'EN_TRANSITO').length}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Completados</p>
            <p className="mt-1 text-3xl font-bold text-green-600">
              {traslados.filter((t) => t.estado === 'COMPLETADO').length}
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Skeleton */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg border bg-muted" />
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Traslado</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-origen">ID Bodega Origen</Label>
              <Input type="number" id="edit-origen" value={formData.bodega_origen || ''} onChange={(e) => setFormData({ ...formData, bodega_origen: Number(e.target.value) })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-destino">ID Bodega Destino</Label>
              <Input type="number" id="edit-destino" value={formData.bodega_destino || ''} onChange={(e) => setFormData({ ...formData, bodega_destino: Number(e.target.value) })} required />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={formData.estado} onValueChange={(val: any) => setFormData({ ...formData, estado: val })}>
                <SelectTrigger><SelectValue placeholder="Seleccione estado" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="EN_TRANSITO">En Tránsito</SelectItem>
                  <SelectItem value="COMPLETADO">Completado</SelectItem>
                  <SelectItem value="CANCELADO">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading}>Guardar Cambios</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Lista de traslados — clickeable para ver detalle */}
      {!loading && traslados.length > 0 && (
        <div className="space-y-3">
          {traslados.map((traslado) => {
            const badge = estadoBadge[traslado.estado]
            return (
              <div
                key={traslado.id}
                onClick={() => navigate(`/warehouse/transfers/${traslado.id}`)}
                className="group cursor-pointer rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className="text-muted-foreground">#{traslado.id}</span>
                      <span>{traslado.bodega_origen_nombre}</span>
                      <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                      <span>{traslado.bodega_destino_nombre}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${badge.className}`}
                    >
                      {badge.icon}
                      {badge.label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    Fecha:{' '}
                    {new Date(traslado.fecha_traslado).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span>{traslado.detalles.length} ítem(s)</span>
                  <span className="text-primary group-hover:underline">Ver detalle →</span>
                </div>
                <div className="mt-4 flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={(e) => openEdit(e, traslado)}>
                    <Edit className="h-4 w-4 mr-2" /> Editar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={(e) => handleDelete(e, traslado.id)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && traslados.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
          <ArrowRightLeft className="h-12 w-12 text-muted-foreground/40" />
          <div>
            <p className="font-medium">Sin traslados registrados</p>
            <p className="text-sm text-muted-foreground">
              No hay movimientos entre bodegas todavía.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
