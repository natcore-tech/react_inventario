// src/presentation/pages/public/HomePage.tsx
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Package, Shield, TrendingUp, Zap,
  CheckCircle2, Boxes, Receipt, Bell,
  ChevronRight, Star, Sparkles, ArrowUpRight,
  ShoppingCart, Crown, Barcode,
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { useReveal } from '@/presentation/hooks/useReveal'

// ─── Animated counter ─────────────────────────────────────────────────────────
function useCounter(target: number, duration = 1800) {
  const [value, setValue] = useState(0)
  const started = useRef(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          setValue(Math.floor(ease * target))
          if (p < 1) requestAnimationFrame(tick)
          else setValue(target)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, duration])

  return { ref, value }
}

// ─── Particle Grid Background ─────────────────────────────────────────────────
function ParticleGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 dot-pattern opacity-25" />
      {[...Array(16)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-primary/70 animate-ping-slow"
          style={{
            left: `${5 + (i % 4) * 28}%`,
            top: `${10 + Math.floor(i / 4) * 24}%`,
            animationDelay: `${i * 0.35}s`,
            animationDuration: `${3 + (i % 3) * 0.9}s`,
          }}
        />
      ))}
      <div className="absolute -top-56 -left-40 w-[750px] h-[750px] rounded-full bg-primary/14 blur-[130px]" />
      <div className="absolute top-1/2 -right-56 w-[550px] h-[550px] rounded-full bg-purple-600/10 blur-[110px]" />
      <div className="absolute -bottom-32 left-1/3 w-[450px] h-[450px] rounded-full bg-primary/10 blur-[100px]" />
    </div>
  )
}

// ─── Float Badge ──────────────────────────────────────────────────────────────
interface FloatBadgeProps {
  icon: React.ComponentType<{ className?: string }>
  label: string; value: string; valueClass?: string; delay?: string
}
function FloatBadge({ icon: Icon, label, value, valueClass = 'text-primary', delay = '' }: FloatBadgeProps) {
  return (
    <div className={`glass-card flex items-center gap-3.5 border-primary/30 bg-card/90 px-4 py-3 shadow-2xl backdrop-blur-2xl animate-float-badge ${delay}`}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/35 bg-primary/15 shadow-inner">
        <Icon className="h-4.5 w-4.5 text-primary" />
      </div>
      <div>
        <p className="mb-0.5 text-[10px] font-medium leading-none text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className={`text-xs font-black ${valueClass}`}>{value}</p>
      </div>
    </div>
  )
}

// ─── Big Hero Image Showcase Mockup ───────────────────────────────────────────
function HeroShowcaseMockup() {
  return (
    <div className="relative w-full group">
      {/* Intense Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-purple-600/20 to-accent/25 blur-3xl rounded-3xl pointer-events-none scale-105" />

      {/* Main Glass Frame Container */}
      <div className="relative rounded-3xl overflow-hidden border border-primary/40 bg-card/90 shadow-2xl shadow-purple-950/50 backdrop-blur-2xl animate-float">
        {/* Browser Chrome Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-muted/60 border-b border-border/50">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500/80 hover:opacity-100 transition-opacity" />
            <span className="h-3 w-3 rounded-full bg-amber-400/80 hover:opacity-100 transition-opacity" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/80 hover:opacity-100 transition-opacity" />
          </div>

          <div className="flex-1 mx-6 max-w-md bg-background/70 rounded-full px-4 py-1.5 text-[11px] font-mono text-muted-foreground flex items-center justify-center gap-2 border border-border/50">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            https://app.stockmaster.live/dashboard
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-primary bg-primary/15 border border-primary/30 px-3 py-0.5 rounded-full uppercase tracking-wider">
              DRF + REACT PRO
            </span>
          </div>
        </div>

        {/* Large Hero Showcase Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-background">
          <img
            src="/images/hero_dashboard_preview.png"
            alt="Stock Master Consola de Control de Inventario 3D"
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80" />

          {/* Overlaid Live Badges */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 p-3.5 bg-card/85 backdrop-blur-xl rounded-2xl border border-primary/30 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/35 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary animate-spin-slow" />
              </div>
              <div>
                <p className="text-xs font-black text-foreground">Sincronización Django REST</p>
                <p className="text-[10px] text-muted-foreground">Endpoints JWT & Roles Activos</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/25">
                <CheckCircle2 className="h-3.5 w-3.5" /> 100% Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function HomePage() {
  const orb1 = useRef<HTMLDivElement>(null)
  const orb2 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (orb1.current) orb1.current.style.transform = `translateY(${y * 0.12}px)`
      if (orb2.current) orb2.current.style.transform = `translateY(${y * -0.08}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const statsRef = useReveal(0.1)
  const bentoRef = useReveal(0.05)
  const ctaRef   = useReveal(0.1)

  const c1 = useCounter(1482)
  const c2 = useCounter(500000)
  const c3 = useCounter(78)
  const c4 = useCounter(99)

  return (
    <div className="space-y-0">

      {/* ── HERO SECTION WITH BIG BACKGROUND & MOCKUP ── */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden pt-12 pb-20">
        <ParticleGrid />
        <div className="mesh-gradient absolute inset-0" aria-hidden="true" />

        {/* Parallax ambient orbs */}
        <div ref={orb1} aria-hidden="true" className="pointer-events-none absolute -left-40 -top-40 h-[560px] w-[560px] rounded-full bg-primary/14 blur-3xl" />
        <div ref={orb2} aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-40 h-[500px] w-[500px] rounded-full bg-purple-600/12 blur-3xl" />

        <div className="container mx-auto grid grid-cols-1 items-center gap-14 px-4 lg:grid-cols-2 lg:gap-16 lg:px-8 relative z-10">

          {/* Left Column: Hero Copy */}
          <div className="animate-slide-up space-y-8">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="section-badge border-primary/40 bg-primary/10">
                <span className="h-2 w-2 rounded-full bg-primary animate-ping-slow" />
                Sistema ERP · Django REST + Frontend Moderno · 2026
              </div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/40 border border-border/50 rounded-full px-3.5 py-1 backdrop-blur-md">
                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                <span className="font-extrabold text-foreground">4.9 / 5</span>
                <span>· Máxima Calidad Comercial</span>
              </div>
            </div>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-balance md:text-6xl xl:text-7xl text-foreground">
              Gestión de <br />
              <span className="gradient-text text-glow animate-gradient-x">inventario</span> sin <br />
              complicaciones
            </h1>

            <p className="max-w-lg text-base md:text-lg leading-relaxed text-muted-foreground text-pretty">
              Plataforma integral para pymes: control absoluto sobre bodegas, productos, ventas y POS con trazabilidad completa en tiempo real.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="btn-glow h-13 gap-2 px-8 text-base font-extrabold rounded-2xl w-full sm:w-auto">
                  Comenzar gratis ahora
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/features">
                <Button
                  variant="outline" size="lg"
                  className="h-13 gap-2 border-border/70 px-8 text-base rounded-2xl hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 w-full sm:w-auto"
                >
                  Ver características
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Micro Badges */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 border-t border-border/30">
              {['Multi-bodega activo', 'Roles Django (is_staff)', 'POS ultrarrápido'].map((b) => (
                <div key={b} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  {b}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Large Interactive 3D Showcase */}
          <div className="animate-slide-left relative delay-200">
            {/* Floating Badges */}
            <div className="absolute -left-6 top-8 z-20 animate-float-badge">
              <FloatBadge icon={TrendingUp} label="Ventas hoy" value="+12.4%" valueClass="text-emerald-400" />
            </div>
            <div className="absolute -right-4 bottom-24 z-20 animate-float-badge delay-500">
              <FloatBadge icon={Package} label="Stock bajo" value="3 alertas" valueClass="text-amber-400" />
            </div>
            <div className="absolute left-1/2 -top-6 z-20 -translate-x-1/2 animate-float-badge delay-300">
              <FloatBadge icon={Zap} label="POS Uptime" value="99.9%" valueClass="text-primary" />
            </div>

            <HeroShowcaseMockup />
          </div>

        </div>
      </section>

      {/* ── STATS BAND WITH GLASS CARDS ── */}
      <section className="py-16 border-y border-border/40 bg-card/20 backdrop-blur-md">
        <div ref={statsRef} className="reveal container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { ref: c1.ref, value: c1.value, suffix: '+',  label: 'Productos Gestionados', sub: 'En catálogo activo' },
              { ref: c2.ref, value: c2.value, suffix: '+',  label: 'Transacciones Procesadas', sub: 'Cobros y facturas' },
              { ref: c3.ref, value: c3.value, suffix: '%',  label: 'Reducción de Errores', sub: 'Trazabilidad de almacén' },
              { ref: c4.ref, value: c4.value, suffix: '.9%',label: 'Uptime Garantizado', sub: 'Servidor REST 24/7' },
            ].map(({ ref, value, suffix, label, sub }, i) => (
              <div key={label} className={`glass-card p-6 text-center space-y-2 reveal delay-${i + 1} hover:border-primary/45 transition-all duration-300`}>
                <div className="stat-number text-3xl sm:text-4xl">
                  <span ref={ref}>{value.toLocaleString()}</span>{suffix}
                </div>
                <p className="text-xs sm:text-sm font-bold text-foreground">{label}</p>
                <p className="text-[11px] text-muted-foreground">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MASSIVE FEATURE SHOWCASE IMAGE SECTION ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 space-y-12">

          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="section-badge">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Consola Unificada 3D
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
              Visualiza cada movimiento con <span className="gradient-text">precisión milimétrica</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Diseñado con estética Bento Grid, bordes con resplandor neón morado y paneles transparentes para un control total sin fricción.
            </p>
          </div>

          {/* Large Background Feature Banner */}
          <div className="relative rounded-3xl overflow-hidden border border-primary/35 shadow-2xl bg-card/70 backdrop-blur-2xl p-3 sm:p-5 group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-900/10 to-transparent pointer-events-none" />

            <img
              src="/images/features_analytics_mockup.png"
              alt="Módulo de Analítica y POS Stock Master"
              className="w-full h-auto rounded-2xl object-cover max-h-[520px] shadow-2xl transition-transform duration-700 group-hover:scale-[1.01]"
            />

            {/* Floating Info Cards Over Banner */}
            <div className="absolute bottom-6 left-6 right-6 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-background/85 backdrop-blur-2xl p-5 rounded-2xl border border-primary/30 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                  <Boxes className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-foreground">Stock Sincronizado</p>
                  <p className="text-[10px] text-muted-foreground">Multi-bodega automatizado</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-foreground">Punto de Venta POS</p>
                  <p className="text-[10px] text-muted-foreground">Cobro en menos de 10 seg</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-foreground">Seguridad por Roles</p>
                  <p className="text-[10px] text-muted-foreground">Evaluación is_staff backend</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── BENTO GRID SECTION ── */}
      <section className="py-20 border-t border-border/40">
        <div className="container mx-auto px-4 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="section-badge">Módulos Principales</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Diseñado para operar con <span className="gradient-text">máxima velocidad</span>
            </h2>
          </div>

          <div ref={bentoRef} className="reveal grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Bento Card 1 (Wide): Multi-Bodega */}
            <div className="glass-card p-8 md:col-span-2 space-y-6 relative overflow-hidden group">
              <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-primary/12 rounded-full blur-3xl group-hover:bg-primary/22 transition-all duration-700 pointer-events-none" />
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                  <Boxes className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-extrabold text-primary bg-primary/10 border border-primary/25 rounded-full px-3 py-1 uppercase tracking-wider">
                  Módulo Almacén
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-foreground group-hover:text-primary transition-colors mb-2">
                  Control Multi-Bodega & Traslados Físicos
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg">
                  Gestiona múltiples bodegas o sucursales, realiza transferencias entre almacenes con trazabilidad en tránsito y asigna ubicaciones por pasillo y estante.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {[
                  { name: 'Bodega Principal', stock: '1,420 un.', status: 'Óptimo' },
                  { name: 'Sucursal Norte', stock: '850 un.', status: 'Activo' },
                  { name: 'Sucursal Sur', stock: '310 un.', status: 'Alerta Stock' },
                ].map(({ name, stock, status }) => (
                  <div key={name} className="p-3 rounded-xl bg-background/50 border border-border/40 space-y-1">
                    <p className="text-xs font-bold text-foreground">{name}</p>
                    <p className="text-[11px] font-mono text-primary">{stock}</p>
                    <span className="text-[9px] font-semibold text-muted-foreground">{status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bento Card 2: POS Terminal */}
            <div className="glass-card p-8 space-y-6 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Receipt className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-foreground group-hover:text-emerald-400 transition-colors mb-2">
                  Punto de Venta POS
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Turnos de caja con cuadre de efectivo, lector de código de barras y emisión e impresión de tickets.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                  <span>Velocidad Promedio</span>
                  <span>⚡ 8.5s por Ticket</span>
                </div>
              </div>
            </div>

            {/* Bento Card 3: Security JWT */}
            <div className="glass-card p-8 space-y-6 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Shield className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-foreground group-hover:text-purple-400 transition-colors mb-2">
                  Roles & Autenticación JWT
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Validación estricta del campo is_staff de Django REST para asignar la vista de administración o panel operativo.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/25 px-2.5 py-1 rounded-lg">
                  is_staff = true (Admin)
                </span>
                <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/25 px-2.5 py-1 rounded-lg">
                  is_staff = false (Operativo)
                </span>
              </div>
            </div>

            {/* Bento Card 4 (Wide): Notifications & Barcode */}
            <div className="glass-card p-8 md:col-span-2 space-y-6 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Bell className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/25 rounded-full px-3 py-1 uppercase tracking-wider">
                  Alertas Inteligentes
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-foreground group-hover:text-amber-400 transition-colors mb-2">
                  Notificaciones de Stock Mínimo & Números de Serie
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg">
                  Seguimiento unitario para productos de alto valor con número de serie único y alertas tempranas automáticas antes de que ocurran faltantes.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground bg-background/60 border border-border/40 px-3 py-1.5 rounded-xl">
                  <Barcode className="h-4 w-4 text-primary" /> Serie: #SN-892401
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/25 px-3 py-1.5 rounded-xl">
                  <Bell className="h-4 w-4" /> Stock Crítico (Quedan 2 un.)
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── WORKFLOW / HOW IT WORKS ── */}
      <section className="py-24 border-t border-border/40 bg-card/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div className="space-y-6">
              <span className="section-badge">Despliegue Inmediato</span>
              <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
                Listo para operar en <br />
                <span className="gradient-text">menos de 10 minutos</span>
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
                Sin configuraciones complejas de servidor. Inicia sesión, define tu catálogo y atiende ventas en tiempo récord.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  '1. Registro de cuenta y login JWT seguro',
                  '2. Definición de bodegas y categorías de productos',
                  '3. Apertura de turno de caja e inicio de ventas POS',
                  '4. Auditoría de movimientos y reportes de inventario',
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-3 p-3.5 rounded-2xl glass-card border-border/40">
                    <div className="w-7 h-7 rounded-xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-bold text-xs shrink-0">
                      ✓
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-foreground">{step}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link to="/register">
                  <Button size="lg" className="btn-glow font-extrabold px-8 h-12 rounded-2xl">
                    Crear mi cuenta gratis <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column illustration card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/15 blur-3xl rounded-3xl pointer-events-none" />
              <div className="relative glass-card p-6 sm:p-8 space-y-6 border-primary/30">
                <div className="flex items-center justify-between border-b border-border/30 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                      <Crown className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-foreground">Consola de Administración</p>
                      <p className="text-[11px] text-muted-foreground">Vista de staff con permisos avanzados</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                    Acceso Total
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { title: 'Gestión de Usuarios (is_staff)', desc: 'Promueve o degrada roles dinámicamente' },
                    { title: 'Ajustes de Inventario', desc: 'Registra entradas, salidas y mermas con auditoría' },
                    { title: 'Órdenes de Compra', desc: 'Control de pedidos a proveedores e insumos' },
                  ].map(({ title, desc }) => (
                    <div key={title} className="p-3.5 rounded-xl bg-background/60 border border-border/40 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-foreground">{title}</p>
                        <p className="text-[10px] text-muted-foreground">{desc}</p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-primary shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA BOTTOM SECTION ── */}
      <section className="py-24 border-t border-border/40 relative overflow-hidden">
        <div ref={ctaRef} className="reveal container mx-auto px-4 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden border border-primary/35 p-8 sm:p-14 text-center space-y-8 bg-card/60 backdrop-blur-2xl">
            <div className="absolute inset-0 mesh-gradient opacity-80 pointer-events-none" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative space-y-6 max-w-2xl mx-auto">
              <span className="section-badge">Pymes & Cadenas Comerciales</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
                Lleva el control de tu inventario al <span className="gradient-text text-glow">siguiente nivel</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Empieza hoy mismo con tu cuenta de prueba. Acceso completo a todos los módulos y switch de tema dual persistente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Link to="/register">
                  <Button size="lg" className="btn-glow h-13 px-10 text-base font-extrabold rounded-2xl w-full sm:w-auto">
                    Crear cuenta gratis <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="h-13 px-8 text-base rounded-2xl border-border/70 hover:border-primary/50 hover:bg-primary/10 w-full sm:w-auto">
                    Iniciar Sesión
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
