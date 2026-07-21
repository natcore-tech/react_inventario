// src/presentation/pages/DashboardAdminPage.tsx
import { useEffect, useMemo } from 'react'
import {
  Package,
  DollarSign,
  PackageX,
  BellRing,
  ClipboardList,
  RotateCcw,
} from 'lucide-react'

import { useProductoStore } from '@/presentation/store/producto.store'
import { useAlertaStockMinimoStore } from '@/presentation/store/alerta-stock-minimo.store'
import { useAjusteInventarioStore } from '@/presentation/store/ajuste-inventario.store'
import { useDevolucionClienteStore } from '@/presentation/store/devolucion-cliente.store'
import { colors } from '@/presentation/theme/colors'
import { TIPO_AJUSTE_LABELS } from '@/domain/entities/ajuste-inventario.entity'
import { ESTADO_PRODUCTO_DEVOLUCION_LABELS } from '@/domain/entities/devolucion-cliente.entity'

const currencyFormatter = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

function formatFecha(isoString: string): string {
  return new Date(isoString).toLocaleDateString('es-EC', { day: '2-digit', month: 'short' })
}

interface MetricCardProps {
  icon: React.ReactNode
  label: string
  value: string
  accent: string
}

function MetricCard({ icon, label, value, accent }: MetricCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${accent}22`, color: accent }}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  )
}

export default function DashboardAdminPage() {
  const { productos, loadProductos } = useProductoStore()
  const { alertas, loadAlertas } = useAlertaStockMinimoStore()
  const { ajustes, loadAjustes } = useAjusteInventarioStore()
  const { devoluciones, loadDevoluciones } = useDevolucionClienteStore()

  useEffect(() => {
    loadProductos()
    loadAlertas()
    loadAjustes()
    loadDevoluciones()
  }, [loadProductos, loadAlertas, loadAjustes, loadDevoluciones])

  const metrics = useMemo(() => {
    const activos = productos.filter((p) => p.es_activo)
    const valorTotal = activos.reduce((sum, p) => sum + p.stock * p.precio_con_impuesto, 0)
    const sinStock = productos.filter((p) => !p.en_stock).length

    const productosPorId = new Map(productos.map((p) => [p.id, p]))
    const alertasActivas = alertas.filter((a) => {
      const producto = productosPorId.get(a.producto)
      return a.activa && producto && producto.stock <= a.cantidad_minima
    }).length

    return { totalProductos: activos.length, valorTotal, sinStock, alertasActivas }
  }, [productos, alertas])

  function getProductoNombre(productoId: number): string {
    return productos.find((p) => p.id === productoId)?.nombre ?? `Producto #${productoId}`
  }

  const actividadReciente = useMemo(() => {
    const items = [
      ...ajustes.map((a) => ({
        id: `ajuste-${a.id}`,
        tipo: 'ajuste' as const,
        fecha: a.creado_en,
        producto: getProductoNombre(a.producto),
        detalle: TIPO_AJUSTE_LABELS[a.tipo_ajuste],
        cantidad: a.cantidad,
      })),
      ...devoluciones.map((d) => ({
        id: `devolucion-${d.id}`,
        tipo: 'devolucion' as const,
        fecha: d.fecha_devolucion,
        producto: getProductoNombre(d.producto),
        detalle: ESTADO_PRODUCTO_DEVOLUCION_LABELS[d.estado_producto],
        cantidad: d.cantidad,
      })),
    ]
    return items
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 8)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ajustes, devoluciones, productos])

  const alertasParaMostrar = useMemo(() => {
    return alertas
      .filter((a) => {
        const producto = productos.find((p) => p.id === a.producto)
        return a.activa && producto && producto.stock <= a.cantidad_minima
      })
      .slice(0, 6)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertas, productos])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard — Métricas de Inventario</h1>
        <p className="text-sm text-muted-foreground">Resumen general del estado actual del inventario</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={<Package className="h-5 w-5" />} label="Productos Activos" value={metrics.totalProductos.toString()} accent={colors.primary} />
        <MetricCard icon={<DollarSign className="h-5 w-5" />} label="Valor Total de Inventario" value={currencyFormatter.format(metrics.valorTotal)} accent={colors.success} />
        <MetricCard icon={<PackageX className="h-5 w-5" />} label="Productos Sin Stock" value={metrics.sinStock.toString()} accent={colors.error} />
        <MetricCard icon={<BellRing className="h-5 w-5" />} label="Alertas Activas" value={metrics.alertasActivas.toString()} accent={colors.warning} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Actividad Reciente</h2>
          {actividadReciente.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Sin movimientos recientes.</p>
          ) : (
            <div className="space-y-1">
              {actividadReciente.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: `${item.tipo === 'ajuste' ? colors.warning : colors.success}22`,
                        color: item.tipo === 'ajuste' ? colors.warning : colors.success,
                      }}
                    >
                      {item.tipo === 'ajuste' ? <ClipboardList className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.producto}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.tipo === 'ajuste' ? 'Ajuste' : 'Devolución'} · {item.detalle} · {formatFecha(item.fecha)}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-semibold" style={{ color: item.cantidad > 0 ? colors.success : colors.error }}>
                    {item.cantidad > 0 ? '+' : ''}
                    {item.cantidad}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Alertas de Stock</h2>
          {alertasParaMostrar.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Sin alertas activas.</p>
          ) : (
            <div className="space-y-3">
              {alertasParaMostrar.map((alerta) => {
                const producto = productos.find((p) => p.id === alerta.producto)
                return (
                  <div
                    key={alerta.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                    style={{ borderColor: `${colors.error}33`, backgroundColor: `${colors.error}11` }}
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{producto?.nombre ?? `Producto #${alerta.producto}`}</p>
                      <p className="text-xs text-muted-foreground">Mínimo: {alerta.cantidad_minima}</p>
                    </div>
                    <span className="font-mono text-sm font-semibold" style={{ color: colors.error }}>
                      {producto?.stock ?? '—'}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}