// src/presentation/pages/public/HomePage.tsx
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Package, Shield, TrendingUp, Zap,
  CheckCircle2, Boxes, Receipt, Bell,
  ChevronRight, Star, Sparkles, Barcode, HelpCircle,
  Check, X, ChevronDown,
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
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-primary/70 animate-ping-slow"
          style={{
            left: `${4 + (i % 5) * 22}%`,
            top: `${8 + Math.floor(i / 5) * 22}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${3 + (i % 3) * 0.8}s`,
          }}
        />
      ))}
      <div className="absolute -top-56 -left-40 w-[750px] h-[750px] rounded-full bg-primary/14 blur-[130px]" />
      <div className="absolute top-1/3 -right-56 w-[600px] h-[600px] rounded-full bg-purple-600/12 blur-[120px]" />
      <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px]" />
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

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="glass-card overflow-hidden border-border/50 transition-all duration-300">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-foreground hover:text-primary transition-colors"
      >
        <span className="flex items-center gap-3">
          <HelpCircle className="h-4 w-4 text-primary shrink-0" />
          {q}
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${open ? 'rotate-180 text-primary' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0 text-xs text-muted-foreground leading-relaxed border-t border-border/30 animate-fade-in">
          {a}
        </div>
      )}
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

  const statsRef   = useReveal(0.1)
  const bentoRef   = useReveal(0.05)
  const tabsRef    = useReveal(0.05)
  const compareRef = useReveal(0.05)
  const faqRef     = useReveal(0.05)
  const ctaRef     = useReveal(0.1)

  const c1 = useCounter(1482)
  const c2 = useCounter(500000)
  const c3 = useCounter(78)
  const c4 = useCounter(99)

  const [activeTab, setActiveTab] = useState(0)

  const FEATURE_TABS = [
    {
      id: 'multi',
      title: 'Control Multi-Bodega & Sucursales',
      badge: 'Almacenes Físicos',
      desc: 'Centraliza el control de tus inventarios distribuidos en múltiples instalaciones, depósitos o sucursales comerciales. Sincroniza existencias en tiempo real, gestiona solicitudes de traslado entre bodegas con trazabilidad de despacho y recepción, y define ubicaciones físicas detalladas por pasillo, estante y casilla para optimizar el picking.',
      bullets: [
        'Transferencias inmediatas con estado En Tránsito y Recepción Confirmada',
        'Zonificación por Pasillo, Estante y Nivel de almacenamiento',
        'Límites de stock mínimo y máximo personalizados por cada sucursal',
        'Valorización en tiempo real por depósito según costo promedio',
        'Alertas de quiebre de stock diferenciadas por tienda física',
      ],
      codeSample: `GET /api/bodegas/stock-global/\n{\n  "bodega_principal": { "skus": 1420, "valor_total": "$48,920.00" },\n  "sucursal_norte": { "skus": 850, "valor_total": "$22,140.00" }\n}`,
    },
    {
      id: 'pos',
      title: 'Punto de Venta POS Ultrarrápido',
      badge: 'Facturación & Caja',
      desc: 'Transforma la atención a tus clientes con una terminal de cobro diseñada para máxima velocidad operativa. Compatible con escáneres de código de barras USB/Bluetooth, cobro multimoneda y métodos de pago combinados (Efectivo, Tarjeta, Transferencia). Controla turnos de caja con apertura, arqueo intermedio y cierre con cuadre ciego.',
      bullets: [
        'Búsqueda por código de barras, SKU o coincidencia fonética de producto',
        'Apertura y cierre de caja con reporte de diferencias de efectivo',
        'Emisión e impresión instantánea de tickets de venta y facturas',
        'Gestión de descuentos por ítem o por total del carrito con autorización',
        'Modo contingencia con sincronización diferida de comprobantes',
      ],
      codeSample: `POST /api/pos/ventas/\n{\n  "turno_id": 842,\n  "metodo_pago": "EFECTIVO",\n  "total": 145.50,\n  "items": [{ "sku": "PRD-901", "qty": 2 }]\n}`,
    },
    {
      id: 'series',
      title: 'Números de Serie & Auditoría Total',
      badge: 'Trazabilidad Unitaria',
      desc: 'Supervisa productos de alto valor o con garantía mediante seguimiento unitario por número de serie único. Registra el historial inmutable de cada ítem desde la compra al proveedor hasta la venta final. Realiza ajustes de inventario por merma, rotura o vencimiento obligando a justificar el motivo para auditorías sin fisuras.',
      bullets: [
        'Rastreo individual de número de serie desde la orden de compra',
        'Historial cronológico de cambios de ubicación y responsable',
        'Kardex valorizado detallado por cada SKU e ítem unitario',
        'Ajustes de stock con motivo predefinido y aprobación requerida',
        'Soporte para devoluciones de clientes con reingreso automático',
      ],
      codeSample: `GET /api/productos/series/SN-892401/\n{\n  "estado": "VENDIDO",\n  "cliente": "Corporación Andes S.A.",\n  "ticket": "#TK-49120"\n}`,
    },
    {
      id: 'jwt',
      title: 'Seguridad JWT & Roles DRF (`is_staff`)',
      badge: 'Permisos & Backend',
      desc: 'Protección de datos de nivel bancario respaldada por Django REST Framework. El sistema evalúa el campo is_staff en la base de datos para segmentar automáticamente la interfaz: los administradores acceden al panel completo de compras y usuarios, mientras los vendedores son derivados a una consola operativa ágil.',
      bullets: [
        'Tokens JWT de corta duración con mecanismo de refresco transparente',
        'Restricción estricta de endpoints sensibles en el servidor Django',
        'Gestión dinámica de usuarios y permisos desde la vista privada de admin',
        'Bitácora inmutable de acciones realizadas por cada operador',
        'Cierre automático de sesión por inactividad o revocación de token',
      ],
      codeSample: `PROFILE RESPONSE:\n{\n  "id": 12,\n  "username": "vendedor_norte",\n  "is_staff": false, // Redirige a Panel Operativo POS\n  "is_active": true\n}`,
    },
  ]

  return (
    <div className="space-y-0">

      {/* ── HERO SECTION WITH BIG BACKGROUND & MOCKUP ── */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden pt-12 pb-24">
        <ParticleGrid />
        <div className="mesh-gradient absolute inset-0 opacity-90" aria-hidden="true" />

        {/* Parallax ambient orbs */}
        <div ref={orb1} aria-hidden="true" className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-primary/16 blur-3xl" />
        <div ref={orb2} aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-40 h-[550px] w-[550px] rounded-full bg-purple-600/14 blur-3xl" />

        <div className="container mx-auto grid grid-cols-1 items-center gap-14 px-4 lg:grid-cols-2 lg:gap-16 lg:px-8 relative z-10">

          {/* Left Column: Hero Copy (EXTREMELY DETAILED & DENSE) */}
          <div className="animate-slide-up space-y-8">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="section-badge border-primary/40 bg-primary/10">
                <span className="h-2 w-2 rounded-full bg-primary animate-ping-slow" />
                Sistema ERP · Django REST + Frontend Moderno 2026
              </div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/40 border border-border/50 rounded-full px-3.5 py-1 backdrop-blur-md">
                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                <span className="font-extrabold text-foreground">4.9 / 5.0</span>
                <span>· Calidad Comercial Garantizada</span>
              </div>
            </div>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-balance md:text-6xl xl:text-7xl text-foreground">
              Gestión de <br />
              <span className="gradient-text text-glow animate-gradient-x">inventario ERP</span> sin <br />
              complicaciones
            </h1>

            <p className="max-w-xl text-base md:text-lg leading-relaxed text-muted-foreground text-pretty">
              Plataforma empresarial de alta velocidad para pymes y cadenas comerciales. Automatiza el control absoluto sobre bodegas, almacenes físicos, ventas en punto de venta (POS) y auditorías con sincronización en tiempo real y seguridad respaldada por Django REST.
            </p>

            {/* DENSE FEATURE PARAGRAPH */}
            <div className="p-4 rounded-2xl bg-card/60 border border-primary/25 backdrop-blur-md space-y-2 max-w-xl">
              <p className="text-xs font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                ¿Por qué Stock Master es la solución definitiva?
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Eliminamos por completo los descuadres en planillas de Excel y los costos excesivos de los ERPs tradicionales. Ofrecemos arquitectura ligera en la nube, soporte para números de serie únicos, control de cajas registradoras y enrutamiento inteligente según el rol <code className="text-primary font-mono">is_staff</code> de tus empleados.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="btn-glow h-13 gap-2 px-8 text-base font-extrabold rounded-2xl w-full sm:w-auto">
                  Crear cuenta gratis ahora
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/features">
                <Button
                  variant="outline" size="lg"
                  className="h-13 gap-2 border-border/70 px-8 text-base rounded-2xl hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 w-full sm:w-auto"
                >
                  Explorar todos los módulos
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Micro Badges Row */}
            <div className="flex flex-wrap gap-x-6 gap-y-2.5 pt-4 border-t border-border/30">
              {[
                'Multi-bodega activo',
                'Roles Django (is_staff)',
                'POS ultrarrápido',
                'Números de serie',
                'Reportes PDF / Excel',
              ].map((b) => (
                <div key={b} className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
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

            {/* Main Glass Frame Container */}
            <div className="relative rounded-3xl overflow-hidden border border-primary/40 bg-card/90 shadow-2xl shadow-purple-950/50 backdrop-blur-2xl animate-float">
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
                <span className="text-[10px] font-bold text-primary bg-primary/15 border border-primary/30 px-3 py-0.5 rounded-full uppercase tracking-wider">
                  DRF + REACT PRO
                </span>
              </div>

              <div className="relative aspect-[16/10] overflow-hidden bg-background">
                <img
                  src="/images/hero_dashboard_preview.png"
                  alt="Stock Master Consola de Control de Inventario 3D"
                  className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80" />

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
                  <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/25">
                    <CheckCircle2 className="h-3.5 w-3.5" /> 100% Online
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── STATS BAND WITH DETAILED DESCRIPTIONS ── */}
      <section className="py-16 border-y border-border/40 bg-card/20 backdrop-blur-md">
        <div ref={statsRef} className="reveal container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { ref: c1.ref, value: c1.value, suffix: '+',  label: 'Productos Registrados', sub: 'Catálogo activo con SKU e imagen' },
              { ref: c2.ref, value: c2.value, suffix: '+',  label: 'Transacciones Procesadas', sub: 'Tickets de POS y facturación' },
              { ref: c3.ref, value: c3.value, suffix: '%',  label: 'Reducción de Mermas', sub: 'Mediante auditoría de kardex' },
              { ref: c4.ref, value: c4.value, suffix: '.9%',label: 'Uptime del Servidor REST', sub: 'Disponibilidad en la nube 24/7' },
            ].map(({ ref, value, suffix, label, sub }, i) => (
              <div key={label} className={`glass-card p-6 text-center space-y-2 reveal delay-${i + 1} hover:border-primary/45 transition-all duration-300`}>
                <div className="stat-number text-3xl sm:text-4xl">
                  <span ref={ref}>{value.toLocaleString()}</span>{suffix}
                </div>
                <p className="text-xs sm:text-sm font-bold text-foreground">{label}</p>
                <p className="text-[11px] text-muted-foreground leading-snug">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE FEATURE TABS WITH DEEP CONTENT ── */}
      <section className="py-24 border-t border-border/40 relative overflow-hidden">
        <div ref={tabsRef} className="reveal container mx-auto px-4 lg:px-8 space-y-12">

          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="section-badge">Arquitectura & Funcionalidades</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
              Explora en profundidad los <span className="gradient-text">módulos de la plataforma</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Selecciona una categoría para examinar el funcionamiento técnico, las capacidades operativas y las muestras de integración con nuestra API REST.
            </p>
          </div>

          {/* Tab Selector Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {FEATURE_TABS.map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(idx)}
                className={`px-5 py-3 rounded-2xl text-xs font-black transition-all duration-300 border ${
                  activeTab === idx
                    ? 'border-primary/60 bg-primary/20 text-primary shadow-lg shadow-primary/10'
                    : 'border-border/50 bg-card/40 text-muted-foreground hover:bg-card hover:text-foreground'
                }`}
              >
                {tab.title.split(' ')[0]} {tab.title.split(' ')[1]}
              </button>
            ))}
          </div>

          {/* Active Tab Detailed View */}
          <div className="glass-card p-8 lg:p-12 border-primary/35 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[10px] font-extrabold text-primary bg-primary/10 border border-primary/25 rounded-full px-3 py-1 uppercase tracking-wider">
                {FEATURE_TABS[activeTab].badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-foreground">
                {FEATURE_TABS[activeTab].title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {FEATURE_TABS[activeTab].desc}
              </p>

              <div className="space-y-3 pt-2">
                {FEATURE_TABS[activeTab].bullets.map((b) => (
                  <div key={b} className="flex items-start gap-3 text-xs font-semibold text-foreground/90">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Code / Visual Box */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border border-border/50 bg-background/80 p-5 space-y-3 font-mono text-xs shadow-xl">
                <div className="flex items-center justify-between border-b border-border/40 pb-3 text-muted-foreground text-[10px]">
                  <span>ESTRUCTURA DE DATOS DRF</span>
                  <span className="text-emerald-400">STATUS 200 OK</span>
                </div>
                <pre className="overflow-x-auto text-primary text-[11px] leading-relaxed">
                  <code>{FEATURE_TABS[activeTab].codeSample}</code>
                </pre>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── MASSIVE BENTO GRID SECTION (PACKED WITH TEXT) ── */}
      <section className="py-24 border-t border-border/40">
        <div className="container mx-auto px-4 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="section-badge">Consola Unificada Bento Grid</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
              Diseñado para operar con <span className="gradient-text">máxima densidad de datos</span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cada módulo ofrece información completa sin recargar la pantalla. Todo a un clic de distancia.
            </p>
          </div>

          <div ref={bentoRef} className="reveal grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Bento Card 1 (Wide): Multi-Bodega */}
            <div className="glass-card p-8 md:col-span-2 space-y-6 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                  <Boxes className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-extrabold text-primary bg-primary/10 border border-primary/25 rounded-full px-3 py-1 uppercase tracking-wider">
                  Módulo Almacén & Traslados
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-extrabold text-foreground group-hover:text-primary transition-colors">
                  Control Multi-Bodega & Ubicaciones de Almacenamiento
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Administra múltiples bodegas físicas o centros de distribución. Transfiere productos entre sucursales notificando el estado en tránsito y requiriendo confirmación de recepción para evitar pérdidas de mercadería. Asigna ubicaciones físicas exactas por pasillo, estante y casilla para agilizar el despacho.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {[
                  { name: 'Bodega Principal', stock: '1,420 SKUs', status: 'Capacidad 82%' },
                  { name: 'Sucursal Norte', stock: '850 SKUs', status: 'Capacidad 45%' },
                  { name: 'Sucursal Sur', stock: '310 SKUs', status: 'Stock Bajo' },
                ].map(({ name, stock, status }) => (
                  <div key={name} className="p-3.5 rounded-xl bg-background/60 border border-border/40 space-y-1">
                    <p className="text-xs font-bold text-foreground">{name}</p>
                    <p className="text-[11px] font-mono text-primary font-bold">{stock}</p>
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

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-foreground group-hover:text-emerald-400 transition-colors">
                  Punto de Venta POS & Cajas
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Terminal de cobro ultrarrápida con arqueo de caja ciego, soporte para lector de código de barras, emisión de comprobantes e historial de turnos cerrados.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold space-y-1">
                <p className="flex justify-between"><span>Promedio por Ticket:</span> <span>⚡ 8.5 seg</span></p>
                <p className="text-[10px] text-muted-foreground font-normal">Compatible con impresoras térmicas de 80mm</p>
              </div>
            </div>

            {/* Bento Card 3: Security JWT */}
            <div className="glass-card p-8 space-y-6 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Shield className="h-6 w-6" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-foreground group-hover:text-purple-400 transition-colors">
                  Seguridad & Roles (`is_staff`)
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Evaluación estricta de credenciales en el servidor Django. Los usuarios de staff acceden al panel completo, mientras los usuarios normales operan en el POS.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <div className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/25 px-3 py-1.5 rounded-xl">
                  is_staff = true → Admin (Auditoría + Compras)
                </div>
                <div className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/25 px-3 py-1.5 rounded-xl">
                  is_staff = false → Operador POS (Ventas)
                </div>
              </div>
            </div>

            {/* Bento Card 4 (Wide): Notifications & Series */}
            <div className="glass-card p-8 md:col-span-2 space-y-6 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Bell className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/25 rounded-full px-3 py-1 uppercase tracking-wider">
                  Trazabilidad Unitaria
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-extrabold text-foreground group-hover:text-amber-400 transition-colors">
                  Alertas de Stock Mínimo & Números de Serie Únicos
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Seguimiento de productos por número de serie inmutable para garantías y trazabilidad de origen. Notificaciones preventivas automáticas antes de agotar existencias en sucursal.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground bg-background/60 border border-border/40 px-3.5 py-2 rounded-xl">
                  <Barcode className="h-4 w-4 text-primary" /> Serie: #SN-892401-PRO
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/25 px-3.5 py-2 rounded-xl">
                  <Bell className="h-4 w-4" /> Alerta: Recomprar 15 unidades
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── COMPARISON MATRIX (STOCK MASTER VS EXCEL / OTROS) ── */}
      <section className="py-24 border-t border-border/40 bg-card/20 backdrop-blur-md">
        <div ref={compareRef} className="reveal container mx-auto px-4 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="section-badge">Comparativa Comercial</span>
            <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
              ¿Por qué migrar a <span className="gradient-text">Stock Master</span>?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Compara las capacidades operativas de nuestra plataforma frente a hojas de cálculo tradicionales o sistemas ERP heredados.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="glass-card overflow-hidden border-primary/30">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/50 text-foreground uppercase tracking-wider text-[10px]">
                    <th className="p-4 font-black">Característica / Módulo</th>
                    <th className="p-4 font-black text-primary bg-primary/10 text-center">Stock Master ERP</th>
                    <th className="p-4 font-black text-muted-foreground text-center">Planillas de Excel</th>
                    <th className="p-4 font-black text-muted-foreground text-center">ERPs Tradicionales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30 text-muted-foreground">
                  {[
                    { f: 'Sincronización Multi-Bodega en Tiempo Real', sm: true, ex: false, erp: true },
                    { f: 'Terminal POS ultrarrápida con cobro en <10s', sm: true, ex: false, erp: false },
                    { f: 'Rastreo unitario por Número de Serie', sm: true, ex: false, erp: true },
                    { f: 'Enrutamiento estricto por rol is_staff', sm: true, ex: false, erp: false },
                    { f: 'Cero costos de servidor o instalación física', sm: true, ex: true, erp: false },
                    { f: 'Auditoría inmutable de kardex por operador', sm: true, ex: false, erp: true },
                    { f: 'Interfaz moderna estilo Bento Grid con Modo Oscuro', sm: true, ex: false, erp: false },
                  ].map(({ f, sm, ex, erp }) => (
                    <tr key={f} className="hover:bg-card/60 transition-colors">
                      <td className="p-4 font-bold text-foreground">{f}</td>
                      <td className="p-4 text-center bg-primary/5">
                        {sm ? <Check className="h-5 w-5 text-primary mx-auto" /> : <X className="h-5 w-5 text-rose-500 mx-auto" />}
                      </td>
                      <td className="p-4 text-center">
                        {ex ? <Check className="h-5 w-5 text-emerald-400 mx-auto" /> : <X className="h-5 w-5 text-rose-500/60 mx-auto" />}
                      </td>
                      <td className="p-4 text-center">
                        {erp ? <Check className="h-5 w-5 text-emerald-400 mx-auto" /> : <X className="h-5 w-5 text-rose-500/60 mx-auto" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── FREQUENTLY ASKED QUESTIONS (FAQ) ── */}
      <section className="py-24 border-t border-border/40">
        <div ref={faqRef} className="reveal container mx-auto px-4 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="section-badge">Preguntas Frecuentes</span>
            <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
              Respuestas claras a tus <span className="gradient-text">dudas técnicas</span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Resolvemos tus inquietudes sobre integración, seguridad de datos y uso diario del sistema.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <FAQItem
              q="¿Cómo funciona el control de roles con `is_staff` de Django REST?"
              a="La base de datos de Django evalúa la propiedad is_staff en la tabla auth_user. Si es verdadera, el usuario recibe acceso a la consola de administración (métricas globales, gestión de usuarios, auditorías y órdenes de compra). Si es falsa, el frontend redirige automáticamente al panel operativo optimizado para ventas POS e inventario básico."
            />
            <FAQItem
              q="¿Puedo gestionar varias sucursales o bodegas físicas simultáneamente?"
              a="Sí. Stock Master permite registrar múltiples bodegas y sucursales. Puedes consultar el stock independiente de cada lugar, realizar transferencias con estado en tránsito y recibir notificaciones de recepción confirmada."
            />
            <FAQItem
              q="¿Se pueden importar mis datos actuales desde archivos de Excel?"
              a="Por supuesto. Contamos con herramientas de importación rápida de productos, clientes y proveedores mediante plantillas CSV o Excel para que inicies operaciones en menos de 10 minutos."
            />
            <FAQItem
              q="¿El sistema funciona en dispositivos móviles o tablets?"
              a="Sí. La plataforma está optimizada con diseño responsivo адапtativo y tecnología Tailwind CSS v4, lo que permite operar la terminal POS o consultar el inventario desde computadoras, tablets o smartphones."
            />
            <FAQItem
              q="¿Qué ocurre si se corta la conexión a Internet temporalmente?"
              a="La terminal POS cuenta con almacenamiento local diferido. Puedes seguir registrando ventas y comprobantes; una vez restablecida la conexión, los datos se sincronizan automáticamente con el backend Django REST."
            />
          </div>
        </div>
      </section>

      {/* ── CTA BOTTOM SECTION ── */}
      <section className="py-24 border-t border-border/40 relative overflow-hidden">
        <div ref={ctaRef} className="reveal container mx-auto px-4 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden border border-primary/35 p-8 sm:p-14 text-center space-y-8 bg-card/60 backdrop-blur-2xl">
            <div className="absolute inset-0 mesh-gradient opacity-80 pointer-events-none" />

            <div className="relative space-y-6 max-w-2xl mx-auto">
              <span className="section-badge">Prueba Comercial sin Riesgo</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
                Toma el control absoluto de tu inventario <span className="gradient-text text-glow">hoy mismo</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Empieza hoy con tu cuenta de prueba. Acceso completo a todos los módulos y switch de tema dual persistente.
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
