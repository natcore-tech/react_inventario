// src/presentation/pages/warehouse/StockBodegaPage.tsx
import { useEffect, useState } from 'react'
import { useStockBodegaStore } from '@/presentation/store/stock-bodega.store'
import { BarChart3, RefreshCw, AlertCircle, Package, Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/presentation/components/ui/dialog'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'

export default function StockBodegaPage() {
  const { stocks, loading, error, fetchStocks, createStockBodega, updateStockBodega, deleteStockBodega } = useStockBodegaStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingStock, setEditingStock] = useState<any>(null)
  
  const [formData, setFormData] = useState({ bodega: 0, producto: 0, cantidad: 0 })

  useEffect(() => {
    fetchStocks()
  }, [fetchStocks])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await createStockBodega(formData)
    setIsCreateOpen(false)
    setFormData({ bodega: 0, producto: 0, cantidad: 0 })
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingStock) return
    await updateStockBodega(editingStock.id, formData)
    setIsEditOpen(false)
    setEditingStock(null)
  }

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este registro de stock?')) {
      await deleteStockBodega(id)
    }
  }

  const openEdit = (stock: any) => {
    setEditingStock(stock)
    setFormData({ bodega: stock.bodega, producto: stock.producto, cantidad: stock.cantidad })
    setIsEditOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Stock en Bodegas</h1>
            <p className="text-sm text-muted-foreground">
              Inventario actual por bodega y producto
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Stock
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Stock</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bodega">ID Bodega</Label>
                  <Input type="number" id="bodega" value={formData.bodega || ''} onChange={(e) => setFormData({ ...formData, bodega: Number(e.target.value) })} required />
                </div>
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

          <Button
            onClick={() => fetchStocks()}
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Skeleton */}
      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg border bg-muted" />
          ))}
        </div>
      )}

      {/* Tabla */}
      {!loading && stocks.length > 0 && (
        <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Producto</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Bodega</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Cantidad</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stocks.map((stock) => (
                  <tr
                    key={stock.id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <td className="px-4 py-3 text-muted-foreground">{stock.id}</td>
                    <td className="px-4 py-3 font-medium">{stock.producto_nombre}</td>
                    <td className="px-4 py-3 text-muted-foreground">{stock.bodega_nombre}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-semibold ${
                          stock.cantidad <= 0
                            ? 'text-destructive'
                            : stock.cantidad < 10
                            ? 'text-yellow-600'
                            : 'text-green-600'
                        }`}
                      >
                        {stock.cantidad}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(stock)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(stock.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t px-4 py-2 text-xs text-muted-foreground">
            {stocks.length} registro{stocks.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Stock</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-bodega">ID Bodega</Label>
              <Input type="number" id="edit-bodega" value={formData.bodega || ''} onChange={(e) => setFormData({ ...formData, bodega: Number(e.target.value) })} required />
            </div>
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

      {/* Empty state */}
      {!loading && !error && stocks.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
          <Package className="h-12 w-12 text-muted-foreground/40" />
          <div>
            <p className="font-medium">Sin registros de stock</p>
            <p className="text-sm text-muted-foreground">
              No hay datos de stock en bodegas todavía.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
