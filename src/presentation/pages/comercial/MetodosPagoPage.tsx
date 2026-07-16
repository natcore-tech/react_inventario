// src/presentation/pages/comercial/MetodosPagoPage.tsx
import { useEffect } from 'react'
import {
  Loader2,
  CreditCard,
  AlertCircle,
  Wallet,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

import { useMetodoPagoStore } from '@/presentation/store/metodo-pago.store'

// ─── Helper: formatea fecha ISO a "DD/MM/YYYY" ────────────────────────────────

function formatFecha(isoString: string): string {
  const fecha = new Date(isoString)
  return fecha.toLocaleDateString('es-EC', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function MetodosPagoPage() {
  const { metodosPago, isLoading, error, loadMetodosPago } = useMetodoPagoStore()

  useEffect(() => {
    loadMetodosPago()
  }, [loadMetodosPago])

  // ── Estado: cargando ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Cargando métodos de pago…</p>
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
          id="btn-retry-metodos-pago"
          onClick={loadMetodosPago}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Reintentar
        </button>
      </div>
    )
  }

  // ── Estado: sin datos ─────────────────────────────────────────────────────
  if (metodosPago.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <CreditCard className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">No hay métodos de pago registrados.</p>
      </div>
    )
  }

  // ── Métricas rápidas ──────────────────────────────────────────────────────
  const totalActivos = metodosPago.filter((m) => m.es_activo).length
  const totalInactivos = metodosPago.filter((m) => !m.es_activo).length

  // ── Datos ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 p-6">
      {/* ── Encabezado ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Métodos de Pago</h1>
        <p className="text-sm text-muted-foreground">
          {metodosPago.length} método{metodosPago.length !== 1 ? 's' : ''} configurado{metodosPago.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* ── Tarjetas de métricas ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          id="metric-total-metodos"
          icon={<Wallet className="h-5 w-5 text-primary" />}
          label="Total"
          value={metodosPago.length.toString()}
        />
        <MetricCard
          id="metric-metodos-activos"
          icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
          label="Activos"
          value={totalActivos.toString()}
        />
        <MetricCard
          id="metric-metodos-inactivos"
          icon={<XCircle className="h-5 w-5 text-primary" />}
          label="Inactivos"
          value={totalInactivos.toString()}
        />
      </div>

      {/* ── Grilla de tarjetas de métodos de pago ──────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {metodosPago.map((metodo) => (
          <div
            key={metodo.id}
            id={`metodo-pago-card-${metodo.id}`}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted/20"
          >
            {/* Icono + nombre */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold text-foreground">{metodo.nombre}</span>
            </div>

            {/* Badge de estado */}
            <div>
              {metodo.es_activo ? (
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

            {/* Fechas */}
            <div className="border-t border-border pt-3 text-xs text-muted-foreground space-y-0.5">
              <p>Creado: {formatFecha(metodo.creado_en)}</p>
              <p>Actualizado: {formatFecha(metodo.actualizado_en)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer informativo ──────────────────────────────────────────── */}
      <p className="text-xs text-muted-foreground">
        {totalInactivos > 0 && (
          <span className="font-medium text-destructive">
            ⚠ {totalInactivos} método{totalInactivos !== 1 ? 's' : ''} inactivo{totalInactivos !== 1 ? 's' : ''}.{' '}
          </span>
        )}
        Mostrando {metodosPago.length} registro{metodosPago.length !== 1 ? 's' : ''}.
      </p>
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
