// src/presentation/pages/inventory/MarcasPage.tsx
import { useEffect } from 'react'
import { useMarcaStore } from '@/presentation/store/marca.store'
import { Tag, RefreshCw, AlertCircle, Package } from 'lucide-react'

export default function MarcasPage() {
  const { marcas, loading, error, fetchMarcas } = useMarcaStore()

  useEffect(() => {
    fetchMarcas()
  }, [fetchMarcas])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Tag className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Marcas</h1>
            <p className="text-sm text-muted-foreground">
              Catálogo de marcas registradas en el sistema
            </p>
          </div>
        </div>
        <button
          onClick={() => fetchMarcas()}
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

      {/* Loading skeleton */}
      {loading && (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-lg border bg-muted"
            />
          ))}
        </div>
      )}

      {/* Tabla de Marcas */}
      {!loading && marcas.length > 0 && (
        <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <span className="text-sm font-medium text-muted-foreground">
              {marcas.length} marca{marcas.length !== 1 ? 's' : ''} encontrada{marcas.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="divide-y">
            {marcas.map((marca) => (
              <div
                key={marca.id}
                className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/40"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  {marca.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{marca.nombre}</p>
                  <p className="text-xs text-muted-foreground">ID: {marca.id}</p>
                </div>
                <span className="rounded-full border bg-background px-2.5 py-0.5 text-xs font-medium">
                  Activa
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && marcas.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
          <Package className="h-12 w-12 text-muted-foreground/40" />
          <div>
            <p className="font-medium">Sin marcas registradas</p>
            <p className="text-sm text-muted-foreground">
              No hay marcas en la base de datos todavía.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
