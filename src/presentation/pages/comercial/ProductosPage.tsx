// src/presentation/pages/comercial/ProductosPage.tsx
import { useEffect, useState, useMemo } from 'react'
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
  Search,
  Filter,
  RefreshCw,
} from 'lucide-react'

import { useProductoStore } from '@/presentation/store/producto.store'
import { useCategoriaStore } from '@/presentation/store/categoria.store'
import type { Producto } from '@/domain/entities/producto.entity'
import ProductoFormDialog from './ProductoFormDialog'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
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

export default function ProductosPage() {
  const { productos, isLoading, error, loadProductos, deleteProducto } =
    useProductoStore()
  const { categorias, loadCategorias } = useCategoriaStore()

  // ── Estado local de UI ────────────────────────────────────────────────────
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Producto | null>(null)

  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')

  useEffect(() => {
    loadProductos()
    loadCategorias()
  }, [loadProductos, loadCategorias])

  // ── Filtrado en tiempo real ───────────────────────────────────────────────
  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const matchSearch =
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchCat =
        selectedCategory === 'ALL' ||
        p.categoria.id.toString() === selectedCategory ||
        p.categoria.nombre === selectedCategory

      return matchSearch && matchCat
    })
  }, [productos, searchTerm, selectedCategory])

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
  if (isLoading && productos.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Cargando catálogo de productos…</p>
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
          <p className="font-semibold text-foreground">Ocurrió un error al cargar productos</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </div>
        <Button id="btn-retry-productos" variant="outline" onClick={loadProductos}>
          <RefreshCw className="mr-2 h-4 w-4" /> Reintentar
        </Button>
      </div>
    )
  }

  // ── Métricas rápidas ──────────────────────────────────────────────────────
  const totalActivos = productos.filter((p) => p.es_activo).length
  const precioPromedio =
    productos.length > 0
      ? productos.reduce((acc, p) => acc + parseFloat(p.precio), 0) / productos.length
      : 0

  return (
    <>
      <div className="space-y-6 p-6">
        {/* ── Encabezado ───────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Catálogo de Productos</h1>
            <p className="text-sm text-muted-foreground">
              {productosFiltrados.length} de {productos.length} productos mostrados
            </p>
          </div>
          <Button id="btn-nuevo-producto" onClick={handleNew} className="btn-glow shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>

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

        {/* ── Barra de Búsqueda y Filtros en tiempo real ─────────────── */}
        <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar producto por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background/50 border-border/60 focus:border-primary/60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Categorías filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-10 rounded-md border border-border/60 bg-background/50 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="ALL">Todas las Categorías</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id.toString()}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            {(searchTerm || selectedCategory !== 'ALL') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('ALL')
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </div>

        {/* ── Estado vacío ────────────────────────────────────────── */}
        {productosFiltrados.length === 0 && (
          <div className="glass-card flex min-h-[30vh] flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/40">
              <PackageSearch className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">No se encontraron productos</p>
              <p className="text-xs text-muted-foreground mt-1">
                Intenta ajustar los filtros de búsqueda o registra un nuevo producto en el catálogo.
              </p>
            </div>
          </div>
        )}

        {/* ── Tabla de productos dinámicos ───────────────────────────── */}
        {productosFiltrados.length > 0 && (
          <div className="glass-card overflow-hidden rounded-xl border border-border/50">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/30">
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground w-20">Imagen</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Producto</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Categoría</th>
                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Precio Unit.</th>
                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground">P. c/IVA</th>
                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Stock</th>
                    <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Estado</th>
                    <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {productosFiltrados.map((producto) => (
                    <tr
                      key={producto.id}
                      id={`producto-row-${producto.id}`}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/50 bg-muted/40 shadow-sm">
                          {producto.image_url ? (
                            <img 
                              src={producto.image_url} 
                              alt={producto.nombre} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-semibold text-foreground">{producto.nombre}</span>
                        {producto.descripcion && (
                          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                            {producto.descripcion}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          {producto.categoria.nombre}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right font-mono text-foreground font-medium">
                        ${parseFloat(producto.precio).toFixed(2)}
                      </td>

                      <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                        ${producto.precio_con_impuesto.toFixed(2)}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <span
                          className={
                            producto.en_stock
                              ? 'font-bold text-foreground'
                              : 'font-bold text-destructive'
                          }
                        >
                          {producto.stock}
                        </span>
                        {!producto.en_stock && (
                          <span className="ml-1.5 text-[10px] uppercase font-bold text-destructive px-1.5 py-0.5 rounded bg-destructive/10">
                            Agotado
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          {producto.es_activo ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 text-xs font-semibold text-green-400">
                              <CheckCircle2 className="h-3 w-3" />
                              Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 border border-destructive/20 px-2.5 py-0.5 text-xs font-semibold text-destructive">
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
                            id={`btn-editar-producto-${producto.id}`}
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(producto)}
                            className="h-8 w-8 hover:text-primary"
                            title="Editar producto"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            id={`btn-eliminar-producto-${producto.id}`}
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteConfirm(producto)}
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            title="Eliminar producto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Dialog Formulario Crear / Editar ─────────────────────────────── */}
      <ProductoFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        producto={selectedProducto}
      />

      {/* ── Confirmación de Eliminación ─────────────────────────────────── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="glass">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará{' '}
              <strong className="text-foreground font-semibold">{deleteTarget?.nombre}</strong> del catálogo de productos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              id="btn-confirmar-eliminar-producto"
              onClick={handleDeleteExecute}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// ── Tarjeta de métrica helper ───────────────────────────────────────────────
interface MetricCardProps {
  id: string
  icon: React.ReactNode
  label: string
  value: string
}

function MetricCard({ id, icon, label, value }: MetricCardProps) {
  return (
    <div id={id} className="glass-card flex items-center gap-4 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-xl font-bold tracking-tight text-foreground">{value}</p>
      </div>
    </div>
  )
}
