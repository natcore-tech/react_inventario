// src/presentation/pages/comercial/PromocionesPage.tsx
import { useEffect } from 'react'
import {
  Loader2,
  Tag,
  AlertCircle,
  TicketPercent,
  CheckCircle2,
  XCircle,
  CalendarCheck,
} from 'lucide-react'

import { usePromocionStore } from '@/presentation/store/promocion.store'

// ─── Helper: comprueba si una promoción está vigente hoy ─────────────────────

function esVigente(fechaInicio: string, fechaFin: string): boolean {
  const hoy = new Date().toISOString().slice(0, 10)
  return fechaInicio <= hoy && fechaFin >= hoy
}

// ─── Helper: formatea fecha "YYYY-MM-DD" a "DD/MM/YYYY" ──────────────────────

function formatFecha(fecha: string): string {
  const [y, m, d] = fecha.split('-')
  return `${d}/${m}/${y}`
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function PromocionesPage() {
  const { promociones, isLoading, error, loadPromociones } = usePromocionStore()

  useEffect(() => {
    loadPromociones()
  }, [loadPromociones])

  // ── Estado: cargando ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Cargando promociones…</p>
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
          id="btn-retry-promociones"
          onClick={loadPromociones}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Reintentar
        </button>
      </div>
    )
  }

  // ── Estado: sin datos ─────────────────────────────────────────────────────
  if (promociones.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Tag className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">No hay promociones registradas.</p>
      </div>
    )
  }

  // ── Métricas rápidas ──────────────────────────────────────────────────────
  const totalActivas = promociones.filter((p) => p.es_activa).length
  const totalVigentes = promociones.filter(
    (p) => p.es_activa && esVigente(p.fecha_inicio, p.fecha_fin),
  ).length
  const totalInactivas = promociones.filter((p) => !p.es_activa).length

  // ── Datos ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 p-6">
      {/* ── Encabezado ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Promociones</h1>
          <p className="text-sm text-muted-foreground">
            {promociones.length} promoción{promociones.length !== 1 ? 'es' : ''} en el sistema
          </p>
        </div>
      </div>

      {/* ── Tarjetas de métricas ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <MetricCard
          id="metric-total-promociones"
          icon={<TicketPercent className="h-5 w-5 text-primary" />}
          label="Total"
          value={promociones.length.toString()}
        />
        <MetricCard
          id="metric-promociones-activas"
          icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
          label="Activas"
          value={totalActivas.toString()}
        />
        <MetricCard
          id="metric-promociones-vigentes"
          icon={<CalendarCheck className="h-5 w-5 text-primary" />}
          label="Vigentes hoy"
          value={totalVigentes.toString()}
        />
        <MetricCard
          id="metric-promociones-inactivas"
          icon={<XCircle className="h-5 w-5 text-primary" />}
          label="Inactivas"
          value={totalInactivas.toString()}
        />
      </div>

      {/* ── Tabla de promociones ────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nombre</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Producto</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Descuento</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Vigencia</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {promociones.map((promocion) => {
                const vigente = promocion.es_activa && esVigente(promocion.fecha_inicio, promocion.fecha_fin)

                return (
                  <tr
                    key={promocion.id}
                    id={`promocion-row-${promocion.id}`}
                    className="transition-colors hover:bg-muted/20"
                  >
                    {/* Nombre */}
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">{promocion.nombre}</span>
                    </td>

                    {/* Producto asociado */}
                    <td className="px-4 py-3">
                      {promocion.nombre_producto ? (
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          {promocion.nombre_producto}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground/40 italic">General</span>
                      )}
                    </td>

                    {/* Porcentaje de descuento */}
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono font-semibold text-foreground">
                        {parseFloat(promocion.porcentaje_descuento).toFixed(1)}%
                      </span>
                    </td>

                    {/* Fechas de vigencia */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-xs text-muted-foreground">
                          {formatFecha(promocion.fecha_inicio)} → {formatFecha(promocion.fecha_fin)}
                        </span>
                        {vigente && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            <CalendarCheck className="h-3 w-3" />
                            Vigente
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Estado activa/inactiva */}
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        {promocion.es_activa ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                            <CheckCircle2 className="h-3 w-3" />
                            Activa
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                            <XCircle className="h-3 w-3" />
                            Inactiva
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Footer de la tabla */}
        <div className="border-t border-border bg-muted/20 px-4 py-3">
          <p className="text-xs text-muted-foreground">
            {totalVigentes > 0 && (
              <span className="font-medium text-primary">
                ✓ {totalVigentes} promoción{totalVigentes !== 1 ? 'es' : ''} vigente{totalVigentes !== 1 ? 's' : ''} hoy.{' '}
              </span>
            )}
            Mostrando {promociones.length} registro{promociones.length !== 1 ? 's' : ''}.
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
