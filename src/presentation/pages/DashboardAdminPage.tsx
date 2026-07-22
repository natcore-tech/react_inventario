// src/presentation/pages/DashboardAdminPage.tsx
import { useEffect, useMemo } from 'react'
import {
  Package, DollarSign, PackageX, BellRing,
  ClipboardList, RotateCcw, TrendingUp, ArrowUpRight,
} from 'lucide-react'
import { useProductoStore } from '@/presentation/store/producto.store'
import { useAlertaStockMinimoStore } from '@/presentation/store/alerta-stock-minimo.store'
import { useAjusteInventarioStore } from '@/presentation/store/ajuste-inventario.store'
import { useDevolucionClienteStore } from '@/presentation/store/devolucion-cliente.store'
import { colors } from '@/presentation/theme/colors'
import { TIPO_AJUSTE_LABELS } from '@/domain/entities/ajuste-inventario.entity'
import { ESTADO_PRODUCTO_DEVOLUCION_LABELS } from '@/domain/entities/devolucion-cliente.entity'

const fmt = new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-EC', { day: '2-digit', month: 'short' })
}

// ─── Metric card ──────────────────────────────────────────────────────────────
interface MetricCardProps {
  icon: React.ReactNode; label: string; value: string
  accent: string; trend?: string; trendUp?: boolean; delay?: string
}
function MetricCard({ icon, label, value, accent, trend, trendUp, delay = '' }: MetricCardProps) {
  return (
    <div className={`glass-card p-5 flex flex-col gap-4 animate-slide-up ${delay} group`}>
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${accent}18`, borderColor: `${accent}30`, color: accent }}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full border ${trendUp ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-destructive bg-destructive/10 border-destructive/20'}`}>
            <TrendingUp className={`h-3 w-3 ${!trendUp ? 'rotate-180' : ''}`} />
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-2xl font-extrabold tracking-tight text-foreground mt-0.5"
          style={{ textShadow: `0 0 20px ${accent}30` }}>
          {value}
        </p>
      </div>
    </div>
  )
}

// ─── Inline bar chart ─────────────────────────────────────────────────────────
function MiniBarChart() {
  const bars = [
    { h: 55, label: 'L' }, { h: 72, label: 'M' }, { h: 48, label: 'X' },
    { h: 88, label: 'J' }, { h: 63, label: 'V' }, { h: 95, label: 'S' }, { h: 70, label: 'D' },
  ]
  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2 h-20">
        {bars.map(({ h, label }, i) => (
          <div key={label} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t transition-all duration-500 hover:opacity-80 animate-bar-grow"
              style={{
                height: `${h}%`,
                animationDelay: `${i * 80}ms`,
                background: i === 5
                  ? 'hsl(var(--primary))'
                  : 'hsl(var(--primary)/0.20)',
                boxShadow: i === 5 ? '0 0 10px hsl(var(--primary)/0.4)' : 'none',
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {bars.map(({ label }) => (
          <div key={label} className="flex-1 text-center text-[10px] text-muted-foreground">{label}</div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardAdminPage() {
  const { productos, loadProductos }       = useProductoStore()
  const { alertas, loadAlertas }           = useAlertaStockMinimoStore()
  const { ajustes, loadAjustes }           = useAjusteInventarioStore()
  const { devoluciones, loadDevoluciones } = useDevolucionClienteStore()

  useEffect(() => {
    loadProductos(); loadAlertas(); loadAjustes(); loadDevoluciones()
  }, [loadProductos, loadAlertas, loadAjustes, loadDevoluciones])

  const metrics = useMemo(() => {
    const activos    = productos.filter(p => p.es_activo)
    const valorTotal = activos.reduce((s, p) => s + p.stock * p.precio_con_impuesto, 0)
    const sinStock   = productos.filter(p => !p.en_stock).length
    const prodMap    = new Map(productos.map(p => [p.id, p]))
    const alertasActivas = alertas.filter(a => {
      const p = prodMap.get(a.producto)
      return a.activa && p && p.stock <= a.cantidad_minima
    }).length
    return { total: activos.length, valorTotal, sinStock, alertasActivas }
  }, [productos, alertas])

  function getProductoNombre(id: number) {
    return productos.find(p => p.id === id)?.nombre ?? `Producto #${id}`
  }

  const actividad = useMemo(() => {
    const items = [
      ...ajustes.map(a => ({
        id: `aj-${a.id}`, tipo: 'ajuste' as const,
        fecha: a.creado_en, producto: getProductoNombre(a.producto),
        detalle: TIPO_AJUSTE_LABELS[a.tipo_ajuste], cantidad: a.cantidad,
      })),
      ...devoluciones.map(d => ({
        id: `dv-${d.id}`, tipo: 'devolucion' as const,
        fecha: d.fecha_devolucion, producto: getProductoNombre(d.producto),
        detalle: ESTADO_PRODUCTO_DEVOLUCION_LABELS[d.estado_producto], cantidad: d.cantidad,
      })),
    ]
    return items.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, 8)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ajustes, devoluciones, productos])

  const alertasParaMostrar = useMemo(() => {
    return alertas.filter(a => {
      const p = productos.find(p => p.id === a.producto)
      return a.activa && p && p.stock <= a.cantidad_minima
    }).slice(0, 6)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertas, productos])

  return (
    <div className="space-y-7 animate-fade-in">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Dashboard <span className="gradient-text">— Inventario</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Resumen en tiempo real del estado de tu negocio
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 border border-border/40 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping-slow" />
          Datos actualizados
        </div>
      </div>

      {/* ── Metric cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Package className="h-5 w-5" />}
          label="Productos Activos" value={metrics.total.toString()}
          accent={colors.primary} trend="+2 esta semana" trendUp delay="delay-50" />
        <MetricCard
          icon={<DollarSign className="h-5 w-5" />}
          label="Valor Total Inventario" value={fmt.format(metrics.valorTotal)}
          accent={colors.success} trend="+5.2%" trendUp delay="delay-100" />
        <MetricCard
          icon={<PackageX className="h-5 w-5" />}
          label="Productos Sin Stock" value={metrics.sinStock.toString()}
          accent={colors.error} trend={`${metrics.sinStock} críticos`} trendUp={false} delay="delay-150" />
        <MetricCard
          icon={<BellRing className="h-5 w-5" />}
          label="Alertas Activas" value={metrics.alertasActivas.toString()}
          accent={colors.warning} delay="delay-200" />
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Activity feed — 2 cols */}
        <div className="glass-card p-5 lg:col-span-2 animate-slide-up delay-300">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-foreground">Actividad Reciente</h2>
            <span className="text-[11px] text-muted-foreground bg-muted/30 border border-border/40 rounded-full px-2.5 py-1">
              Últimos {actividad.length} eventos
            </span>
          </div>

          {actividad.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10">
              <div className="w-12 h-12 rounded-full bg-muted/30 border border-border/40 flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Sin movimientos recientes</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {actividad.map((item, i) => {
                const isAjuste = item.tipo === 'ajuste'
                const accent   = isAjuste ? colors.warning : colors.success
                return (
                  <div key={item.id}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-muted/20 group animate-slide-right"
                    style={{ animationDelay: `${300 + i * 40}ms` }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
                        style={{ backgroundColor: `${accent}20`, color: accent }}>
                        {isAjuste
                          ? <ClipboardList className="h-4 w-4" />
                          : <RotateCcw className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground leading-tight">{item.producto}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {isAjuste ? 'Ajuste' : 'Devolución'} · {item.detalle} · {formatFecha(item.fecha)}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-bold tabular-nums"
                      style={{ color: item.cantidad > 0 ? colors.success : colors.error }}>
                      {item.cantidad > 0 ? '+' : ''}{item.cantidad}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right column: chart + alerts */}
        <div className="space-y-5">

          {/* Mini chart */}
          <div className="glass-card p-5 animate-slide-up delay-400">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-foreground">Ventas 7 días</h2>
              <span className="flex items-center gap-1 text-[11px] text-green-400 font-semibold">
                <ArrowUpRight className="h-3.5 w-3.5" /> +12.4%
              </span>
            </div>
            <MiniBarChart />
          </div>

          {/* Stock alerts */}
          <div className="glass-card p-5 animate-slide-up delay-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-foreground">Alertas de Stock</h2>
              {alertasParaMostrar.length > 0 && (
                <span className="text-[10px] font-bold text-destructive bg-destructive/10 border border-destructive/20 rounded-full px-2 py-0.5">
                  {alertasParaMostrar.length} críticos
                </span>
              )}
            </div>

            {alertasParaMostrar.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-6">
                <div className="w-10 h-10 rounded-full bg-green-400/10 border border-green-400/20 flex items-center justify-center">
                  <BellRing className="h-4 w-4 text-green-400" />
                </div>
                <p className="text-xs text-muted-foreground text-center">Sin alertas activas</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {alertasParaMostrar.map((alerta, i) => {
                  const producto = productos.find(p => p.id === alerta.producto)
                  return (
                    <div key={alerta.id}
                      className="flex items-center justify-between rounded-xl border p-3 transition-all duration-200 hover:scale-[1.01] animate-slide-up"
                      style={{
                        animationDelay: `${500 + i * 60}ms`,
                        borderColor: `${colors.error}30`,
                        backgroundColor: `${colors.error}0d`,
                      }}>
                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          {producto?.nombre ?? `Producto #${alerta.producto}`}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Mínimo: {alerta.cantidad_minima}</p>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="font-mono text-sm font-extrabold" style={{ color: colors.error }}>
                          {producto?.stock ?? '—'}
                        </span>
                        <span className="text-[9px] text-destructive/70 font-medium">en stock</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
