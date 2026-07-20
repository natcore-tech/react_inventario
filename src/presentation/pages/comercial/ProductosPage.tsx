// src/presentation/pages/comercial/ProductosPage.tsx
import { useEffect, useState } from 'react'
import {
  Loader2,
  PackageSearch,
  AlertCircle,
  Package,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react'

import { useProductoStore } from '@/presentation/store/producto.store'
import type { Producto } from '@/domain/entities/producto.entity'
import ProductoFormDialog from './ProductoFormDialog'
import { Button } from '@/presentation/components/ui/button'
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

// ─── Componente principal ─────────────────────────────────────────────────────

export default function ProductosPage() {
  const { productos, isLoading, isSaving, error, loadProductos, deleteProducto } =
    useProductoStore()

  // ── Estado local de UI ────────────────────────────────────────────────────
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Producto | null>(null)

  useEffect(() => {
    loadProductos()
  }, [loadProductos])

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleNew() {
    setSelectedProducto(null)
    setIsFormOpen(true)
  }

  function handleEdit(producto: Producto) {
    setSelectedProducto(producto)
    setIsFormOpen(true)
  }

  function handleDeleteConfirm(producto: Producto) {
    setDeleteTarget(producto)
  }

  async function handleDeleteExecute() {
    if (!deleteTarget) return
    await deleteProducto(deleteTarget.id)
    setDeleteTarget(null)
  }

  // ── Estado: cargando ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Cargando productos…</p>
      </div>
    )
  }

  // ── Estado: error ─────────────────────────────────────────────────────────
  if (error && productos.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground">Ocurrió un error</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </div>
        <Button id="btn-retry-productos" variant="outline" onClick={loadProductos}>
          Reintentar
        </Button>
      </div>
    )
  }

  // ── Métricas rápidas ──────────────────────────────────────────────────────
  const totalActivos = productos.filter((p) => p.es_activo).length
  const totalSinStock = productos.filter((p) => !p.en_stock).length
  const precioPromedio =
    productos.length > 0
      ? productos.reduce((acc, p) => acc + parseFloat(p.precio), 0) / productos.length
      : 0

  // ── Datos ─────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="space-y-6 p-6">
        {/* ── Encabezado ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Productos</h1>
            <p className="text-sm text-muted-foreground">
              {productos.length} producto{productos.length !== 1 ? 's' : ''} en el catálogo
            </p>
          </div>
          <Button id="btn-nuevo-producto" onClick={handleNew}>
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </Button>
        </div>

        {/* ── Estado vacío (con botón de crear) ────────────────────────── */}
        {productos.length === 0 && (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <PackageSearch className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No hay productos registrados.</p>
          </div>
        )}

        {productos.length > 0 && (
          <>
            {/* ── Tarjetas de métricas ──────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <MetricCard
                id="metric-total-productos"
                icon={<Package className="h-5 w-5 text-primary" />}
                label="Total de productos"
                value={productos.length.toString()}
              />
              <MetricCard
                id="metric-activos"
                icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
                label="Activos"
                value={totalActivos.toString()}
              />
              <MetricCard
                id="metric-precio-promedio"
                icon={<TrendingUp className="h-5 w-5 text-primary" />}
                label="Precio promedio"
                value={`$${precioPromedio.toFixed(2)}`}
              />
            </div>

            {/* ── Tabla de productos ────────────────────────────────────── */}
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground w-28">Imagen</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nombre</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Categoría</th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">Precio</th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">Precio c/IVA</th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">Stock</th>
                      <th className="px-4 py-3 text-center font-medium text-muted-foreground">Estado</th>
                      <th className="px-4 py-3 text-center font-medium text-muted-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {productos.map((producto) => (
                      <tr
                        key={producto.id}
                        id={`producto-row-${producto.id}`}
                        className="transition-colors hover:bg-muted/20"
                      >
                        <td className="px-4 py-3">
                          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/50 shadow-sm transition-transform hover:scale-105">
                            {producto.image_url ? (
                              <img 
                                src={producto.image_url} 
                                alt={producto.nombre} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span className="font-medium text-foreground">{producto.nombre}</span>
                          {producto.descripcion && (
                            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                              {producto.descripcion}
                            </p>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                            {producto.categoria.nombre}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right font-mono text-foreground">
                          ${parseFloat(producto.precio).toFixed(2)}
                        </td>

                        <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                          ${producto.precio_con_impuesto.toFixed(2)}
                        </td>

                        <td className="px-4 py-3 text-right">
                          <span
                            className={
                              producto.en_stock
                                ? 'font-semibold text-foreground'
                                : 'font-semibold text-destructive'
                            }
                          >
                            {producto.stock}
                          </span>
                          {!producto.en_stock && (
                            <span className="ml-1.5 text-xs text-destructive">Sin stock</span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            {producto.es_activo ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                <CheckCircle2 className="h-3 w-3" />
                                Activo
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                                <XCircle className="h-3 w-3" />
                                Inactivo
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Acciones */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              id={`btn-edit-producto-${producto.id}`}
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleEdit(producto)}
                              disabled={isSaving}
                              title="Editar producto"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              id={`btn-delete-producto-${producto.id}`}
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleDeleteConfirm(producto)}
                              disabled={isSaving}
                              title="Eliminar producto"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-border bg-muted/20 px-4 py-3">
                <p className="text-xs text-muted-foreground">
                  {totalSinStock > 0 && (
                    <span className="text-destructive font-medium">
                      ⚠ {totalSinStock} producto{totalSinStock !== 1 ? 's' : ''} sin stock.{' '}
                    </span>
                  )}
                  Mostrando {productos.length} registro{productos.length !== 1 ? 's' : ''}.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Dialogs (montados fuera del scroll para evitar problemas de z-index) ── */}
      <ProductoFormDialog
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open)
          if (!open) setSelectedProducto(null)
        }}
        producto={selectedProducto}
      />

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de eliminar{' '}
              <span className="font-semibold text-foreground">
                {deleteTarget?.nombre}
              </span>
              . Esta acción lo marcará como inactivo y no podrá deshacerse fácilmente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteExecute}
              disabled={isSaving}
            >
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

// ─── Sub-componente: tarjeta de métrica ───────────────────────────────────────

interface MetricCardProps {
  id: string
  icon: React.ReactNode
  label: string
  value: string
}

function MetricCard({ id, icon, label, value }: MetricCardProps) {
  return (
    <div
      id={id}
      className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  )
}
