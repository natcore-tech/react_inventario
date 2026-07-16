// src/presentation/pages/comercial/ProductosPage.tsx
import { useEffect } from 'react'
import { Loader2, PackageSearch, AlertCircle, Package, TrendingUp, CheckCircle2, XCircle } from 'lucide-react'

import { useProductoStore } from '@/presentation/store/producto.store'

// ─── Componente principal ─────────────────────────────────────────────────────

export default function ProductosPage() {
  const { productos, isLoading, error, loadProductos } = useProductoStore()

  useEffect(() => {
    loadProductos()
  }, [loadProductos])

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
  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground">Ocurrió un error</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </div>
        <button
          id="btn-retry-productos"
          onClick={loadProductos}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Reintentar
        </button>
      </div>
    )
  }

  // ── Estado: sin datos ─────────────────────────────────────────────────────
  if (productos.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <PackageSearch className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">No hay productos registrados.</p>
      </div>
    )
  }

  // ── Métricas rápidas ──────────────────────────────────────────────────────
  const totalActivos = productos.filter((p) => p.es_activo).length
  const totalSinStock = productos.filter((p) => !p.en_stock).length
  const precioPromedio =
    productos.reduce((acc, p) => acc + parseFloat(p.precio), 0) / productos.length

  // ── Datos ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 p-6">
      {/* ── Encabezado ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Productos</h1>
          <p className="text-sm text-muted-foreground">
            {productos.length} producto{productos.length !== 1 ? 's' : ''} en el catálogo
          </p>
        </div>
      </div>

      {/* ── Tarjetas de métricas ────────────────────────────────────────── */}
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

      {/* ── Tabla de productos ──────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {/* Cabecera de la tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">#</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nombre</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Categoría</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Precio</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Precio c/IVA</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Stock</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {productos.map((producto) => (
                <tr
                  key={producto.id}
                  id={`producto-row-${producto.id}`}
                  className="transition-colors hover:bg-muted/20"
                >
                  {/* ID */}
                  <td className="px-4 py-3 text-muted-foreground">
                    {producto.id}
                  </td>

                  {/* Nombre + descripción */}
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">{producto.nombre}</span>
                    {producto.descripcion && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {producto.descripcion}
                      </p>
                    )}
                  </td>

                  {/* Categoría */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {producto.categoria.nombre}
                    </span>
                  </td>

                  {/* Precio */}
                  <td className="px-4 py-3 text-right font-mono text-foreground">
                    ${parseFloat(producto.precio).toFixed(2)}
                  </td>

                  {/* Precio con impuesto */}
                  <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                    ${producto.precio_con_impuesto.toFixed(2)}
                  </td>

                  {/* Stock */}
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

                  {/* Estado activo/inactivo */}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer de la tabla */}
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
    </div>
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
