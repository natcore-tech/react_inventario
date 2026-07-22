// src/presentation/pages/DashboardUserPage.tsx
import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingCart, Users, Package, Receipt, TrendingUp,
  ArrowRight, Clock, CreditCard, Percent, ArrowUpRight,
  Boxes, CheckCircle2, AlertCircle, BarChart3,
} from 'lucide-react'
import { useAuthStore } from '@/presentation/store/auth.store'
import { useProductoStore } from '@/presentation/store/producto.store'
import { useVentaStore } from '@/presentation/store/venta.store'
import { colors } from '@/presentation/theme/colors'

const fmt = new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })

// ─── Quick-access card ────────────────────────────────────────────────────────
interface QuickCardProps {
  icon: React.ReactNode
  label: string
  desc: string
  to: string
  accent: string
  delay?: string
}
function QuickCard({ icon, label, desc, to, accent, delay = '' }: QuickCardProps) {
  return (
    <Link to={to}
      className={`glass-card p-5 flex flex-col gap-3 group hover:scale-[1.02] transition-all duration-300 animate-slide-up ${delay}`}>
      <div className="flex items-center justify-between">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${accent}18`, borderColor: `${accent}30`, color: accent }}>
          {icon}
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
      </div>
      <div>
        <p className="text-sm font-bold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{desc}</p>
      </div>
    </Link>
  )
}

// ─── Stat chip ────────────────────────────────────────────────────────────────
interface StatChipProps {
  label: string; value: string; accent: string; trendUp?: boolean; delay?: string
}
function StatChip({ label, value, accent, trendUp, delay = '' }: StatChipProps) {
  return (
    <div className={`glass-card p-4 flex items-center gap-4 animate-slide-up ${delay}`}>
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <p className="text-[11px] font-medium text-muted-foreground truncate">{label}</p>
        <p className="text-xl font-extrabold tracking-tight truncate"
          style={{ color: accent }}>{value}</p>
      </div>
      {trendUp !== undefined && (
        <TrendingUp className={`h-4 w-4 shrink-0 ${trendUp ? 'text-green-400' : 'text-destructive rotate-180'}`} />
      )}
    </div>
  )
}

// ─── Mini bar chart ───────────────────────────────────────────────────────────
function MiniBar() {
  const bars = [42, 68, 55, 82, 60, 95, 73]
  return (
    <div className="flex items-end gap-1.5 h-14">
      {bars.map((h, i) => (
        <div key={i} className="flex-1 rounded-t animate-bar-grow transition-opacity hover:opacity-80"
          style={{
            height: `${h}%`,
            animationDelay: `${i * 70}ms`,
            background: i === 5 ? 'hsl(var(--primary))' : 'hsl(var(--primary)/0.22)',
            boxShadow: i === 5 ? '0 0 10px hsl(var(--primary)/0.4)' : 'none',
          }} />
      ))}
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function DashboardUserPage() {
  const user = useAuthStore((s) => s.user)
  const { productos, loadProductos } = useProductoStore()
  const { ventas, loadVentas } = useVentaStore()

  useEffect(() => {
    loadProductos()
    loadVentas()
  }, [loadProductos, loadVentas])

  const stats = useMemo(() => {
    const activos   = productos.filter(p => p.es_activo).length
    const sinStock  = productos.filter(p => !p.en_stock).length
    const totalVentas = ventas.length
    const valorVentas = ventas.reduce((s, v) => s + Number(v.total ?? 0), 0)
    return { activos, sinStock, totalVentas, valorVentas }
  }, [productos, ventas])

  const greeting = useMemo(() => {
    const h = new Date().getHours()
    if (h < 12) return 'Buenos días'
    if (h < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }, [])

  const displayName = user?.first_name || user?.username || 'Usuario'

  return (
    <div className="space-y-7 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            {greeting},{' '}
            <span className="gradient-text">{displayName}</span> 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Panel operativo — acceso rápido a tus módulos de trabajo
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 border border-border/40 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping-slow" />
          Sesión activa
        </div>
      </div>

      {/* ── Role notice ── */}
      <div className="glass-card p-3.5 flex items-center gap-3 border-primary/25 bg-primary/5 animate-slide-down">
        <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
          <CheckCircle2 className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground">Cuenta operativa activa</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Tienes acceso completo a Ventas, POS, Clientes e Inventario. Contacta al administrador para permisos adicionales.
          </p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatChip label="Productos Activos" value={stats.activos.toString()}
          accent={colors.primary} trendUp delay="delay-50" />
        <StatChip label="Ventas Registradas" value={stats.totalVentas.toString()}
          accent={colors.success} trendUp delay="delay-100" />
        <StatChip label="Valor Ventas" value={fmt.format(stats.valorVentas)}
          accent={colors.info} delay="delay-150" />
        <StatChip label="Sin Stock" value={stats.sinStock.toString()}
          accent={colors.error} trendUp={false} delay="delay-200" />
      </div>

      {/* ── Quick access ── */}
      <div>
        <h2 className="text-sm font-bold text-foreground mb-4">Acceso Rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickCard
            icon={<ShoppingCart className="h-5 w-5" />}
            label="Punto de Venta (POS)"
            desc="Registra ventas rápidamente con código de barras o búsqueda."
            to="/billing/pos"
            accent={colors.success}
            delay="delay-50"
          />
          <QuickCard
            icon={<Receipt className="h-5 w-5" />}
            label="Historial de Ventas"
            desc="Consulta todas las ventas realizadas y sus detalles."
            to="/billing/history"
            accent={colors.primary}
            delay="delay-100"
          />
          <QuickCard
            icon={<Clock className="h-5 w-5" />}
            label="Turnos de Caja"
            desc="Abre y cierra tu turno, lleva el control de efectivo."
            to="/billing/shifts"
            accent={colors.info}
            delay="delay-150"
          />
          <QuickCard
            icon={<Users className="h-5 w-5" />}
            label="Clientes"
            desc="Gestiona la base de clientes, historial y crédito."
            to="/sales/customers"
            accent={colors.warning}
            delay="delay-200"
          />
          <QuickCard
            icon={<Package className="h-5 w-5" />}
            label="Productos"
            desc="Consulta el catálogo, stock y precios de productos."
            to="/inventory/products"
            accent="hsl(204 69% 53%)"
            delay="delay-250"
          />
          <QuickCard
            icon={<Percent className="h-5 w-5" />}
            label="Promociones"
            desc="Revisa descuentos y promociones activas para aplicar en caja."
            to="/sales/promotions"
            accent="hsl(330 81% 60%)"
            delay="delay-300"
          />
          <QuickCard
            icon={<CreditCard className="h-5 w-5" />}
            label="Métodos de Pago"
            desc="Consulta los métodos de pago disponibles."
            to="/sales/payment-methods"
            accent="hsl(142 58% 49%)"
            delay="delay-350"
          />
          <QuickCard
            icon={<Boxes className="h-5 w-5" />}
            label="Stock Bodega"
            desc="Verifica el stock disponible por bodega."
            to="/warehouse/stock"
            accent="hsl(27 89% 60%)"
            delay="delay-400"
          />
        </div>
      </div>

      {/* ── Bottom panel: chart + status ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Mini chart */}
        <div className="glass-card p-5 animate-slide-up delay-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-foreground">Actividad Reciente</h2>
            <span className="flex items-center gap-1 text-[11px] text-green-400 font-semibold">
              <ArrowUpRight className="h-3.5 w-3.5" /> Esta semana
            </span>
          </div>
          <MiniBar />
          <div className="flex gap-2 mt-2">
            {['L','M','X','J','V','S','D'].map(d => (
              <div key={d} className="flex-1 text-center text-[10px] text-muted-foreground">{d}</div>
            ))}
          </div>
        </div>

        {/* Status / help */}
        <div className="glass-card p-5 animate-slide-up delay-600">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Estado del Sistema</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Servidor API', ok: true },
              { label: 'Base de datos', ok: true },
              { label: 'Módulo POS', ok: true },
              { label: 'Sincronización', ok: true },
            ].map(({ label, ok }) => (
              <div key={label} className="flex items-center justify-between rounded-xl border border-border/30 px-3 py-2.5 bg-muted/10">
                <span className="text-xs font-medium text-foreground">{label}</span>
                <span className={`flex items-center gap-1.5 text-[11px] font-bold ${ok ? 'text-green-400' : 'text-destructive'}`}>
                  {ok
                    ? <><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping-slow" /> Activo</>
                    : <><AlertCircle className="h-3 w-3" /> Error</>}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed">
            ¿Necesitas acceso a módulos de administración?{' '}
            <span className="text-primary font-semibold">Contacta al administrador del sistema.</span>
          </p>
        </div>
      </div>
    </div>
  )
}
