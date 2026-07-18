// src/presentation/pages/warehouse/StockBodegaPage.tsx
import { useEffect } from 'react'
import { useStockBodegaStore } from '@/presentation/store/stock-bodega.store'
import { BarChart3, RefreshCw, AlertCircle, Package } from 'lucide-react'

export default function StockBodegaPage() {
  const { stocks, loading, error, fetchStocks } = useStockBodegaStore()

  useEffect(() => {
    fetchStocks()
  }, [fetchStocks])

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
        <button
          onClick={() => fetchStocks()}
          disabled={loading}
          className="flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
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
