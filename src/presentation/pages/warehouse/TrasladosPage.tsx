// src/presentation/pages/warehouse/TrasladosPage.tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrasladoBodegaStore } from '@/presentation/store/traslado-bodega.store'
import { ArrowRightLeft, RefreshCw, AlertCircle, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react'

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
  const { traslados, loading, error, fetchTraslados } = useTrasladoBodegaStore()

  useEffect(() => {
    fetchTraslados()
  }, [fetchTraslados])

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
        <button
          onClick={() => fetchTraslados()}
          disabled={loading}
          className="flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
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
