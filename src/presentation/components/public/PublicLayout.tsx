// src/presentation/components/public/PublicLayout.tsx
import { useState, useEffect, useRef } from 'react'
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import { Button } from '@/presentation/components/ui/button'
import { ThemeToggle } from '@/presentation/components/ui/ThemeToggle'
import {
  Menu, X, ChevronRight, Package, BarChart3, Shield,
  Boxes, Receipt, Bell, ArrowUpRight,
  Globe, Zap, Star,
} from 'lucide-react'

// ─── Scroll progress bar ──────────────────────────────────────────────────────
function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return (
    <div className="absolute bottom-0 left-0 h-[2px] w-full bg-border/30">
      <div
        className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

// ─── Mega-menu content ────────────────────────────────────────────────────────
const MEGA_FEATURES = [
  { icon: Boxes,    label: 'Multi-Bodega',    desc: 'Gestión de múltiples almacenes', color: 'text-primary' },
  { icon: Receipt,  label: 'POS Ultrarrápido',desc: 'Punto de venta en segundos',     color: 'text-green-400' },
  { icon: BarChart3,label: 'Analytics',       desc: 'Reportes en tiempo real',        color: 'text-blue-400' },
  { icon: Shield,   label: 'Seguridad JWT',   desc: 'Roles y autenticación robusta',  color: 'text-violet-400' },
  { icon: Bell,     label: 'Alertas Stock',   desc: 'Notificaciones automáticas',     color: 'text-amber-400' },
  { icon: Package,  label: 'Catálogo',        desc: 'SKU, series y variantes',        color: 'text-cyan-400' },
]

interface MegaMenuProps { onClose: () => void }
function MegaMenu({ onClose }: MegaMenuProps) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[640px] z-50 animate-scale-in-spring origin-top">
      <div className="glass-card-strong rounded-2xl p-5 shadow-2xl shadow-black/40 border border-primary/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/40">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Módulos del sistema</p>
          <Link
            to="/features"
            onClick={onClose}
            className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
          >
            Ver todo <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        {/* Grid */}
        <div className="grid grid-cols-3 gap-2">
          {MEGA_FEATURES.map(({ icon: Icon, label, desc, color }) => (
            <Link
              key={label}
              to="/features"
              onClick={onClose}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary/8 transition-colors duration-200 group"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground leading-none mb-1">{label}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
        {/* Footer CTA */}
        <div className="mt-4 pt-3 border-t border-border/40 flex items-center gap-3">
          <div className="flex-1 rounded-xl bg-gradient-to-r from-primary/12 to-accent/8 border border-primary/20 p-3 flex items-center gap-3">
            <Zap className="h-4 w-4 text-primary shrink-0" />
            <div>
              <p className="text-xs font-bold text-foreground">¿Listo para empezar?</p>
              <p className="text-[10px] text-muted-foreground">Crea tu cuenta gratis en 2 minutos</p>
            </div>
          </div>
          <Link to="/register" onClick={onClose}>
            <Button size="sm" className="btn-glow font-semibold h-9 shrink-0">
              Comenzar gratis
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Nav link helper ──────────────────────────────────────────────────────────
function tabClass({ isActive }: { isActive: boolean }) {
  return [
    'relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-250 focus-visible:outline-none select-none',
    isActive
      ? 'tab-active'
      : 'text-muted-foreground hover:text-foreground hover:bg-muted/40',
  ].join(' ')
}

// ─── Footer data ──────────────────────────────────────────────────────────────
const FOOTER_LINKS = {
  Plataforma: [
    { to: '/',          label: 'Inicio' },
    { to: '/features',  label: 'Características' },
    { to: '/about',     label: 'Nuestra Historia' },
    { to: '/docs',      label: 'Documentación' },
  ],
  Producto: [
    { to: '/features',  label: 'Multi-Bodega' },
    { to: '/features',  label: 'Punto de Venta POS' },
    { to: '/features',  label: 'Alertas de Stock' },
    { to: '/features',  label: 'Reportes & Analytics' },
  ],
  Cuenta: [
    { to: '/login',     label: 'Iniciar Sesión' },
    { to: '/register',  label: 'Crear Cuenta Gratis' },
    { to: '/docs',      label: 'Guía de Inicio' },
    { to: '/docs',      label: 'Roles y Permisos' },
  ],
}

const TRUST_BADGES = [
  { icon: Globe,  label: 'Latinoamérica' },
  { icon: Shield, label: 'JWT Seguro' },
  { icon: Zap,    label: '99.9% Uptime' },
  { icon: Star,   label: '1,400+ clientes' },
]

// ─── Main layout ─────────────────────────────────────────────────────────────
export default function PublicLayout() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [megaOpen,    setMegaOpen]    = useState(false)
  const megaRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => { setMobileOpen(false); setMegaOpen(false) }, [location])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mega on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header
        className={[
          'shell-header sticky top-0 z-50 animate-slide-down transition-all duration-400 relative',
          scrolled ? 'shadow-xl shadow-black/25' : '',
        ].join(' ')}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0" id="public-logo">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-primary/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-350" />
              <img
                src="/logo_stock.png"
                alt="Stock Master"
                className="relative h-8 w-auto object-contain transition-transform duration-350 group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-extrabold tracking-tight gradient-text text-base">Stock Master</span>
              <span className="text-[9px] text-muted-foreground font-medium tracking-widest uppercase">ERP Inventario</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-0.5 bg-muted/20 rounded-2xl px-2 py-1.5 border border-border/40 backdrop-blur-sm"
            aria-label="Navegación pública"
          >
            <NavLink to="/" end className={tabClass} id="tab-home">Inicio</NavLink>

            {/* Features with mega menu */}
            <div ref={megaRef} className="relative">
              <button
                onClick={() => setMegaOpen(v => !v)}
                className={[
                  'relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-250 focus-visible:outline-none flex items-center gap-1 select-none',
                  location.pathname === '/features'
                    ? 'tab-active'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40',
                ].join(' ')}
              >
                Características
                <ChevronRight className={`h-3 w-3 transition-transform duration-200 ${megaOpen ? 'rotate-90' : ''}`} />
              </button>
              {megaOpen && <MegaMenu onClose={() => setMegaOpen(false)} />}
            </div>

            <NavLink to="/about" className={tabClass} id="tab-about">Historia</NavLink>
            <NavLink to="/docs"  className={tabClass} id="tab-docs">Docs</NavLink>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <Link to="/login" id="nav-login-btn" className="hidden sm:block">
              <Button
                variant="ghost" size="sm"
                className="font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Entrar
              </Button>
            </Link>
            <Link to="/register" id="nav-register-btn" className="hidden sm:block">
              <Button size="sm" className="btn-glow font-semibold gap-1.5 h-9">
                Comenzar gratis
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-border/50 bg-muted/30 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200"
              aria-label="Menú móvil"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={[
            'md:hidden overflow-hidden transition-all duration-350 ease-in-out border-t border-border/40',
            mobileOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0',
          ].join(' ')}
        >
          <nav className="flex flex-col gap-1 px-4 py-4">
            <NavLink to="/"          end className={tabClass}>Inicio</NavLink>
            <NavLink to="/features"      className={tabClass}>Características</NavLink>
            <NavLink to="/about"         className={tabClass}>Historia</NavLink>
            <NavLink to="/docs"          className={tabClass}>Documentación</NavLink>

            <div className="mt-2 pt-3 border-t border-border/40 space-y-2">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest px-2">Módulos rápidos</p>
              <div className="grid grid-cols-3 gap-1.5">
                {MEGA_FEATURES.slice(0, 3).map(({ icon: Icon, label, color }) => (
                  <Link
                    key={label}
                    to="/features"
                    className="flex flex-col items-center gap-1 p-2 rounded-xl bg-muted/30 hover:bg-primary/10 transition-colors text-center"
                  >
                    <Icon className={`h-4 w-4 ${color}`} />
                    <span className="text-[9px] font-semibold text-muted-foreground leading-tight">{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border/40">
              <Link to="/login">
                <Button variant="outline" size="sm" className="w-full">Entrar</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="btn-glow w-full">Comenzar gratis</Button>
              </Link>
            </div>
          </nav>
        </div>

        <ScrollProgress />
      </header>

      {/* ── Page content ─────────────────────────────────────────────────────── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="relative border-t border-border/40 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 mesh-gradient opacity-25 pointer-events-none" />
        <div className="absolute inset-0 dot-pattern opacity-10 pointer-events-none" />

        <div className="relative container mx-auto px-4 lg:px-8 pt-16 pb-8">

          {/* Trust band */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-14 pb-10 border-b border-border/40">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="font-semibold">{label}</span>
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

            {/* Brand col */}
            <div className="space-y-5 lg:col-span-1">
              <div className="flex items-center gap-2.5">
                <img src="/logo_stock.png" alt="Stock Master" className="h-8 w-auto object-contain" />
                <div>
                  <p className="font-extrabold gradient-text text-base leading-none">Stock Master</p>
                  <p className="text-[9px] text-muted-foreground font-medium tracking-widest uppercase mt-0.5">ERP Inventario</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Plataforma ERP de gestión de inventario para pymes latinoamericanas. Multi-bodega, POS ultrarrápido y facturación integrada.
              </p>
              {/* Status indicator */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 border border-border/40 rounded-full px-3 py-1.5 w-fit">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-ping-slow shrink-0" />
                Todos los sistemas operativos
              </div>
              {/* Social proof mini */}
              <div className="flex -space-x-2 items-center gap-3">
                {['C','M','R','A','L'].map((l, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-background bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-[10px] font-bold text-white"
                  >
                    {l}
                  </div>
                ))}
                <span className="text-[10px] text-muted-foreground ml-1 font-medium">+1,400 negocios</span>
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([section, links]) => (
              <div key={section} className="space-y-4">
                <p className="text-xs font-black text-foreground uppercase tracking-widest">{section}</p>
                <nav className="flex flex-col gap-2">
                  {links.map(({ to, label }) => (
                    <Link
                      key={label}
                      to={to}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200 w-fit flex items-center gap-1.5 group"
                    >
                      <ChevronRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>

          {/* Newsletter / CTA band */}
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-card/50 to-accent/8 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-sm font-bold text-foreground">¿Tu negocio aún usa hojas de cálculo?</p>
              <p className="text-xs text-muted-foreground">Únete a miles de pymes que ya digitalizaron su inventario.</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link to="/login">
                <Button variant="outline" size="sm" className="h-9 border-border/60 hover:border-primary/40 text-xs">
                  Ver demo
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="btn-glow h-9 gap-1.5 text-xs font-bold">
                  Comenzar gratis <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="gradient-line mb-6" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-muted-foreground">
              © {new Date().getFullYear()} Stock Master — Todos los derechos reservados
            </p>
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <span>Privacidad</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>Términos</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>Hecho con <span className="text-primary">♥</span> para Latinoamérica</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
