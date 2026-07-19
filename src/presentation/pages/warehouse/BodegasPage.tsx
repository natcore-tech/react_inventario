// src/presentation/pages/warehouse/BodegasPage.tsx
import { useEffect, useState } from 'react'
import { useBodegaStore } from '@/presentation/store/bodega.store'
import { Warehouse, RefreshCw, AlertCircle, MapPin, CheckCircle, XCircle, Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/presentation/components/ui/dialog'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'

export default function BodegasPage() {
  const { bodegas, loading, error, fetchBodegas, createBodega, updateBodega, deleteBodega } = useBodegaStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingBodega, setEditingBodega] = useState<any>(null)
  
  const [formData, setFormData] = useState({ nombre: '', direccion: '', activa: true })

  useEffect(() => {
    fetchBodegas()
  }, [fetchBodegas])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await createBodega({ ...formData, direccion: formData.direccion || null })
    setIsCreateOpen(false)
    setFormData({ nombre: '', direccion: '', activa: true })
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBodega) return
    await updateBodega(editingBodega.id, { ...formData, direccion: formData.direccion || null })
    setIsEditOpen(false)
    setEditingBodega(null)
  }

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta bodega?')) {
      await deleteBodega(id)
    }
  }

  const openEdit = (bodega: any) => {
    setEditingBodega(bodega)
    setFormData({ nombre: bodega.nombre, direccion: bodega.direccion || '', activa: bodega.activa })
    setIsEditOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Warehouse className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Bodegas</h1>
            <p className="text-sm text-muted-foreground">
              Gestión de bodegas y ubicaciones de almacenamiento
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nueva Bodega
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva Bodega</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input id="nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input id="direccion" value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <input type="checkbox" id="activa" checked={formData.activa} onChange={(e) => setFormData({ ...formData, activa: e.target.checked })} />
                  <Label htmlFor="activa">Bodega Activa</Label>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                  <Button type="submit" disabled={loading}>Guardar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Button
            onClick={() => fetchBodegas()}
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
      {!loading && bodegas.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Total Bodegas</p>
            <p className="mt-1 text-3xl font-bold">{bodegas.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Bodegas Activas</p>
            <p className="mt-1 text-3xl font-bold text-green-600">
              {bodegas.filter((b) => b.activa).length}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Bodegas Inactivas</p>
            <p className="mt-1 text-3xl font-bold text-destructive">
              {bodegas.filter((b) => !b.activa).length}
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg border bg-muted" />
          ))}
        </div>
      )}

      {/* Grid de Bodegas */}
      {!loading && bodegas.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bodegas.map((bodega) => (
            <div
              key={bodega.id}
              className="rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Warehouse className="h-5 w-5 text-primary shrink-0" />
                  <h3 className="font-semibold leading-tight">{bodega.nombre}</h3>
                </div>
                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                    bodega.activa
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {bodega.activa ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  {bodega.activa ? 'Activa' : 'Inactiva'}
                </span>
              </div>

              {bodega.direccion && (
                <div className="mt-3 flex items-start gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{bodega.direccion}</span>
                </div>
              )}

              <p className="mt-3 text-xs text-muted-foreground">ID: {bodega.id}</p>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(bodega)}>
                  <Edit className="h-4 w-4 mr-2" /> Editar
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(bodega.id)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Bodega</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nombre">Nombre</Label>
              <Input id="edit-nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-direccion">Dirección</Label>
              <Input id="edit-direccion" value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" id="edit-activa" checked={formData.activa} onChange={(e) => setFormData({ ...formData, activa: e.target.checked })} />
              <Label htmlFor="edit-activa">Bodega Activa</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading}>Guardar Cambios</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && bodegas.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
          <Warehouse className="h-12 w-12 text-muted-foreground/40" />
          <div>
            <p className="font-medium">Sin bodegas registradas</p>
            <p className="text-sm text-muted-foreground">
              No hay bodegas en la base de datos todavía.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
