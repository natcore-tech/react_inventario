// src/presentation/pages/LandingPage.tsx
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag,
  ArrowRight,
  BarChart3,
  Package,
  Shield,
  Zap,
  TrendingUp,
  Globe,
  Lock,
  Layers,
  BookOpen,
  Terminal,
  CheckCircle2,
  Play,
  Star,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { ThemeToggle } from '@/presentation/components/ui/ThemeToggle'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return ref
}

// ─── Floating Particles background ────────────────────────────────────────────

function Particles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {[...Array(18)].map((_, i) => (
        <span
          key={i}
          className="particle absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${60 + Math.random() * 40}%`,
            '--tx': `${(Math.random() - 0.5) * 60}px`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${4 + Math.random() * 4}s`,
            opacity: 0.3 + Math.random() * 0.4,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

// ─── Features data ─────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Package,
    label: 'Multi-Bodega',
    desc: 'Administra múltiples bodegas con trazabilidad completa de cada movimiento de mercadería.',
    size: 'md:col-span-2',
    accent: '#8B5CF6',
  },
  {
    icon: BarChart3,
    label: 'Reportes en Tiempo Real',
    desc: 'Dashboards inteligentes con métricas de ventas, stock y rentabilidad actualizadas al instante.',
    size: '',
    accent: '#A855F7',
  },
  {
    icon: Zap,
    label: 'Punto de Venta Rápido',
    desc: 'Cobra en segundos. Compatible con lectores de código de barras para máxima agilidad.',
    size: '',
    accent: '#7C3AED',
  },
  {
    icon: Shield,
    label: 'Control de Acceso',
    desc: 'Roles diferenciados para staff y cajeros. Tú decides qué puede ver cada usuario.',
    size: '',
    accent: '#9333EA',
  },
  {
    icon: TrendingUp,
    label: 'Alertas de Stock',
    desc: 'Notificaciones automáticas cuando un producto está cerca de agotarse.',
    size: '',
    accent: '#8B5CF6',
  },
  {
    icon: Globe,
    label: 'Acceso Desde Cualquier Lugar',
    desc: 'Plataforma web 100% responsiva. Gestiona tu inventario desde el móvil, tablet o PC.',
    size: 'md:col-span-2',
    accent: '#6D28D9',
  },
]

// ─── Timeline data (About section) ────────────────────────────────────────────

const TIMELINE = [
  {
    year: '2022',
    title: 'El Problema',
    desc: 'Un pequeño negocio familiar en Bogotá perdía miles de dólares al mes por descuadres de inventario. Planillas en Excel, errores humanos y cero visibilidad en tiempo real eran la norma.',
  },
  {
    year: '2023',
    title: 'La Visión',
    desc: 'Un equipo de cinco ingenieros se unió con una misión clara: construir la herramienta que ese negocio necesitaba, escalable para miles más. Meses de investigación, prototipos y entrevistas con dueños de locales.',
  },
  {
    year: '2024',
    title: 'Primer MVP',
    desc: 'Lanzamos la primera versión con gestión de productos, bodegas y punto de venta. Los primeros 12 clientes redujeron sus pérdidas por error humano en un 78% en solo 60 días.',
  },
  {
    year: '2025',
    title: 'Escala',
    desc: 'Incorporamos módulos de compras, trazabilidad por número de serie, alertas inteligentes y un sistema de roles avanzado. La plataforma ya procesa más de 500,000 transacciones mensuales.',
  },
  {
    year: '2026',
    title: 'Hoy',
    desc: 'Stock Master es la plataforma de gestión de inventario más rápida y confiable para pymes en Latinoamérica. Seguimos construyendo el futuro del comercio local.',
  },
]

// ─── Docs sections ─────────────────────────────────────────────────────────────

const DOCS_MENU = [
  { id: 'intro',   label: 'Introducción',       icon: BookOpen },
  { id: 'guide',   label: 'Guía Rápida',        icon: Play },
  { id: 'arch',    label: 'Arquitectura',        icon: Layers },
  { id: 'api',     label: 'Integración API',     icon: Terminal },
  { id: 'roles',   label: 'Roles y Permisos',    icon: Lock },
]

const DOCS_CONTENT: Record<string, { title: string; content: React.ReactNode }> = {
  intro: {
    title: 'Introducción a Stock Master',
    content: (
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>
          <strong className="text-foreground">Stock Master</strong> es una plataforma web de gestión de inventario empresarial diseñada para negocios que necesitan control total sobre su mercadería, ventas y logística — sin la complejidad de los sistemas tradicionales.
        </p>
        <p>
          Construida sobre <strong className="text-foreground">React 19 + Django REST Framework</strong>, ofrece una experiencia de usuario ultra-rápida con datos en tiempo real.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {['Multi-bodega', 'POS integrado', 'Control de roles', 'Alertas automáticas', 'Trazabilidad completa', 'API REST'].map(f => (
            <div key={f} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span className="text-foreground text-xs font-medium">{f}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  guide: {
    title: 'Guía de Inicio Rápido',
    content: (
      <div className="space-y-5 text-sm">
        {[
          { step: '01', title: 'Crear cuenta', desc: 'Regístrate y configura el perfil de tu empresa. Un administrador verifica y activa los permisos.' },
          { step: '02', title: 'Configurar catálogos', desc: 'Crea categorías, marcas, unidades de medida y ubicaciones físicas de tus bodegas.' },
          { step: '03', title: 'Cargar productos', desc: 'Importa o registra tus productos con precio, stock mínimo y número de serie si aplica.' },
          { step: '04', title: 'Abrir turno de caja', desc: 'Inicia un turno desde el módulo de Facturación y comienza a registrar ventas en el POS.' },
          { step: '05', title: 'Monitorear en Dashboard', desc: 'Revisa métricas de ventas, alertas de stock y movimientos de bodega en tiempo real.' },
        ].map(({ step, title, desc }) => (
          <div key={step} className="flex gap-4">
            <span className="shrink-0 w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">{step}</span>
            <div>
              <p className="font-semibold text-foreground">{title}</p>
              <p className="text-muted-foreground leading-relaxed mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  arch: {
    title: 'Arquitectura del Sistema',
    content: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>Stock Master sigue una arquitectura limpia en capas tanto en frontend como backend:</p>
        <div className="rounded-xl border border-border/60 overflow-hidden">
          {[
            { layer: 'Presentación', tech: 'React 19 + Tailwind CSS v4 + shadcn/ui', color: 'text-purple-400' },
            { layer: 'Aplicación', tech: 'Zustand stores + React Hook Form + Zod', color: 'text-violet-400' },
            { layer: 'Dominio', tech: 'Entidades y puertos tipados en TypeScript', color: 'text-indigo-400' },
            { layer: 'Infraestructura', tech: 'Axios adapters + Django REST Framework', color: 'text-blue-400' },
          ].map(({ layer, tech, color }, i) => (
            <div key={layer} className={`flex gap-3 p-3 ${i < 3 ? 'border-b border-border/40' : ''} bg-muted/10`}>
              <span className={`font-mono text-xs font-bold w-28 shrink-0 ${color}`}>{layer}</span>
              <span className="text-xs text-foreground">{tech}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  api: {
    title: 'Integración con la API',
    content: (
      <div className="space-y-4 text-sm">
        <p className="text-muted-foreground">La API REST usa autenticación por token JWT. Configura el endpoint en tu <code className="px-1 py-0.5 rounded bg-muted text-primary text-xs">.env</code>:</p>
        <div className="rounded-xl bg-muted/30 border border-border/60 p-4 font-mono text-xs space-y-1">
          <p><span className="text-muted-foreground"># .env</span></p>
          <p><span className="text-primary">VITE_API_BASE_URL</span>=https://api.tudominio.com</p>
        </div>
        <p className="text-muted-foreground">Ejemplo de autenticación:</p>
        <div className="rounded-xl bg-muted/30 border border-border/60 p-4 font-mono text-xs space-y-1">
          <p><span className="text-blue-400">POST</span> /api/auth/login/</p>
          <p className="text-muted-foreground">{'{'} "username": "admin", "password": "..." {'}'}</p>
          <p className="text-green-400 mt-2">→ {'{'} "access": "eyJ...", "refresh": "eyJ..." {'}'}</p>
        </div>
        <p className="text-muted-foreground text-xs">El token <code className="px-1 py-0.5 rounded bg-muted text-primary">access</code> se envía en cada request como <code className="px-1 py-0.5 rounded bg-muted text-primary">Authorization: Bearer &lt;token&gt;</code>.</p>
      </div>
    ),
  },
  roles: {
    title: 'Roles y Permisos',
    content: (
      <div className="space-y-4 text-sm">
        <p className="text-muted-foreground">Stock Master implementa dos niveles de acceso:</p>
        <div className="space-y-3">
          {[
            {
              role: 'Staff / Administrador',
              flag: 'is_staff = true',
              perms: ['Gestión completa de productos y catálogos', 'Módulos de compras y proveedores', 'Auditoría y ajustes de inventario', 'Reportes y dashboard avanzado', 'Gestión de usuarios'],
              color: 'border-primary/40 bg-primary/5',
            },
            {
              role: 'Cajero / Usuario',
              flag: 'is_staff = false',
              perms: ['Dashboard simplificado', 'Punto de Venta (POS)', 'Consulta de stock disponible'],
              color: 'border-border bg-muted/20',
            },
          ].map(({ role, flag, perms, color }) => (
            <div key={role} className={`rounded-xl border p-4 ${color}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-foreground">{role}</p>
                <code className="text-xs px-2 py-0.5 rounded bg-muted text-primary">{flag}</code>
              </div>
              <ul className="space-y-1.5">
                {perms.map(p => (
                  <li key={p} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="text-xs">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    ),
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [activeDoc, setActiveDoc] = useState('intro')
  const [mobileDocOpen, setMobileDocOpen] = useState(false)

  const heroRef = useReveal(0)
  const featRef = useReveal(0.05)
  const aboutRef = useReveal(0.05)
  const docsRef = useReveal(0.05)
  const ctaRef = useReveal(0.1)

  const doc = DOCS_CONTENT[activeDoc]

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans overflow-x-hidden">

      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <header className="shell-header sticky top-0 z-50 animate-slide-down">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <span className="absolute inset-0 rounded-full bg-primary/30 blur-md" aria-hidden="true" />
            </div>
            <span className="text-base font-bold tracking-tight gradient-text">Stock Master</span>
          </div>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
              Características
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
              Historia
            </a>
            <a href="#docs" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
              Documentación
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-medium hover:text-primary transition-colors">
                Entrar
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="sm"
                className="btn-glow font-medium"
              >
                Empezar gratis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ── HERO ────────────────────────────────────────────────────────────── */}
        <section
          id="hero"
          className="relative hero-bg w-full pt-24 pb-20 md:pt-36 md:pb-28 overflow-hidden"
          aria-labelledby="hero-heading"
        >
          <Particles />

          {/* Decorative glow orbs */}
          <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/8 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute top-1/2 -left-20 w-[300px] h-[300px] rounded-full bg-accent/6 blur-3xl" aria-hidden="true" />

          <div
            ref={heroRef}
            className="reveal container mx-auto px-4 md:px-6 flex flex-col items-center text-center max-w-4xl"
          >
            {/* Pill badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-xs font-semibold text-primary animate-slide-down delay-100">
              <Star className="h-3 w-3 fill-current" />
              Sistema de Inventario Inteligente · 2026
            </div>

            <h1
              id="hero-heading"
              className="animate-slide-up delay-200 text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl leading-[1.08]"
            >
              Controla tu inventario
              <br />
              <span className="gradient-text text-glow">sin complicaciones</span>
            </h1>

            <p className="animate-slide-up delay-300 mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
              Una plataforma integral para gestionar bodegas, ventas y cajas — diseñada para locales que priorizan velocidad, orden y escalabilidad real.
            </p>

            <div className="animate-slide-up delay-400 mt-10 flex flex-col sm:flex-row items-center gap-4">
              <Link to="/login">
                <Button
                  size="lg"
                  id="hero-cta-login"
                  className="btn-glow h-12 px-8 text-base font-semibold"
                >
                  Comenzar ahora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  id="hero-cta-features"
                  className="h-12 px-8 text-base border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                >
                  Ver características
                </Button>
              </a>
            </div>

            {/* Floating mock app preview */}
            <div className="animate-float-slow animate-slide-up delay-500 mt-16 w-full max-w-2xl">
              <div className="glass-card p-1 rounded-2xl glow-sm">
                <div className="rounded-xl overflow-hidden bg-card border border-border/40">
                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/40 bg-muted/30">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                    </div>
                    <div className="flex-1 mx-4 bg-muted/50 rounded px-3 py-0.5 text-xs text-muted-foreground font-mono">
                      stockmaster.app/dashboard
                    </div>
                  </div>
                  {/* Mock content */}
                  <div className="p-5 space-y-4">
                    {/* Metrics row */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Productos', value: '1,482', color: 'text-primary' },
                        { label: 'Ventas hoy', value: '$8,240', color: 'text-green-400' },
                        { label: 'Alertas', value: '3', color: 'text-amber-400' },
                      ].map(m => (
                        <div key={m.label} className="rounded-lg bg-muted/30 border border-border/40 p-3 text-center">
                          <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
                        </div>
                      ))}
                    </div>
                    {/* Fake table rows */}
                    <div className="space-y-2">
                      {['Laptop Pro 15"', 'Mouse Inalámbrico', 'Teclado Mecánico'].map((p, i) => (
                        <div key={p} className="flex items-center justify-between rounded-lg bg-muted/20 border border-border/30 px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
                              <Package className="h-3 w-3 text-primary" />
                            </div>
                            <span className="text-xs text-foreground font-medium">{p}</span>
                          </div>
                          <span className={`text-xs font-semibold ${i === 2 ? 'text-amber-400' : 'text-green-400'}`}>
                            {i === 2 ? 'Stock bajo' : 'OK'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll cue */}
            <a href="#features" className="mt-10 text-muted-foreground hover:text-primary transition-colors animate-float" aria-label="Ver más">
              <ChevronDown className="h-5 w-5" />
            </a>
          </div>
        </section>

        {/* ── FEATURES ────────────────────────────────────────────────────────── */}
        <section
          id="features"
          className="relative w-full py-24 border-t border-border/40"
          aria-labelledby="features-heading"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div ref={featRef} className="reveal">
              <div className="text-center mb-14 max-w-2xl mx-auto">
                <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Funcionalidades</p>
                <h2 id="features-heading" className="text-4xl font-bold tracking-tight">
                  Hecho para el día a día
                </h2>
                <p className="mt-4 text-muted-foreground text-lg">
                  Sin funciones de relleno. Solo lo que realmente usas para manejar tu local con eficiencia.
                </p>
              </div>

              {/* Bento grid */}
              <div className="grid gap-4 md:grid-cols-3 auto-rows-fr">
                {FEATURES.map((f, i) => {
                  const Icon = f.icon
                  return (
                    <div
                      key={f.label}
                      className={`glass-card p-6 group ${f.size} reveal delay-${(i + 1) as 1 | 2 | 3 | 4 | 5 | 6}`}
                    >
                      <div className="feature-icon mb-4">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-bold text-base mb-2 group-hover:text-primary transition-colors duration-200">{f.label}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── ABOUT / HISTORIA ────────────────────────────────────────────────── */}
        <section
          id="about"
          className="relative w-full py-24 border-t border-border/40 overflow-hidden"
          aria-labelledby="about-heading"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" aria-hidden="true" />
          <div className="container mx-auto px-4 md:px-6">
            <div ref={aboutRef} className="reveal">
              <div className="text-center mb-14 max-w-2xl mx-auto">
                <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Nuestra Historia</p>
                <h2 id="about-heading" className="text-4xl font-bold tracking-tight">
                  De una planilla de Excel a{' '}
                  <span className="gradient-text">una plataforma de clase mundial</span>
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Cada gran producto nace de un problema real. Este es el nuestro.
                </p>
              </div>

              {/* Timeline */}
              <div className="relative max-w-3xl mx-auto">
                {/* Vertical line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent md:left-1/2" aria-hidden="true" />

                <div className="space-y-10">
                  {TIMELINE.map((item, i) => (
                    <div
                      key={item.year}
                      className={`reveal delay-${(i + 1) as 1 | 2 | 3 | 4 | 5} relative flex gap-6 md:gap-0 
                        ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                    >
                      {/* Content card */}
                      <div className={`flex-1 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'} ml-10 md:ml-0`}>
                        <div className="glass-card p-5">
                          <span className="text-xs font-bold text-primary tracking-widest">{item.year}</span>
                          <h3 className="mt-1 font-bold text-foreground">{item.title}</h3>
                          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                      {/* Dot */}
                      <div className="absolute left-4 top-5 w-4 h-4 rounded-full border-2 border-primary bg-background glow-sm md:left-1/2 md:-translate-x-1/2" aria-hidden="true" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── DOCS ────────────────────────────────────────────────────────────── */}
        <section
          id="docs"
          className="relative w-full py-24 border-t border-border/40"
          aria-labelledby="docs-heading"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div ref={docsRef} className="reveal">
              <div className="text-center mb-14 max-w-2xl mx-auto">
                <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Documentación</p>
                <h2 id="docs-heading" className="text-4xl font-bold tracking-tight">
                  Todo lo que necesitas saber
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Guías claras, arquitectura transparente e integración simple.
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto">
                {/* Sidebar desktop */}
                <aside className="md:w-52 shrink-0 hidden md:block">
                  <nav className="glass-card p-2 space-y-1" aria-label="Secciones de documentación">
                    {DOCS_MENU.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        id={`docs-tab-${id}`}
                        onClick={() => setActiveDoc(id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                          ${activeDoc === id
                            ? 'bg-primary/15 text-primary border border-primary/25'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                          }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {label}
                      </button>
                    ))}
                  </nav>
                </aside>

                {/* Mobile menu toggle */}
                <div className="md:hidden">
                  <button
                    onClick={() => setMobileDocOpen(v => !v)}
                    className="w-full flex items-center justify-between glass-card px-4 py-3 text-sm font-medium"
                    aria-expanded={mobileDocOpen}
                  >
                    <span className="text-primary">{DOCS_MENU.find(d => d.id === activeDoc)?.label}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${mobileDocOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileDocOpen && (
                    <div className="glass-card mt-1 p-2 space-y-1 animate-slide-down">
                      {DOCS_MENU.map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => { setActiveDoc(id); setMobileDocOpen(false) }}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                            ${activeDoc === id ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Doc content */}
                <div className="flex-1 glass-card p-6 md:p-8 min-h-[380px] animate-fade-in" key={activeDoc}>
                  <h3 className="text-xl font-bold text-foreground mb-6 pb-4 border-b border-border/50">
                    {doc.title}
                  </h3>
                  {doc.content}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────────── */}
        <section
          className="w-full py-24 border-t border-border/40"
          aria-labelledby="cta-heading"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div ref={ctaRef} className="reveal">
              <div className="relative rounded-2xl overflow-hidden max-w-4xl mx-auto">
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/90 via-purple-600 to-indigo-700" aria-hidden="true" />
                {/* Noise texture */}
                <div className="absolute inset-0 noise opacity-40" aria-hidden="true" />
                {/* Glow orb */}
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" aria-hidden="true" />

                <div className="relative px-8 py-16 text-center flex flex-col items-center text-white">
                  <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    ¿Listo para tomar el control?
                  </h2>
                  <p className="text-white/80 mb-10 max-w-lg text-lg">
                    Deja el Excel atrás. Empieza a gestionar tu negocio con precisión y velocidad real.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/register">
                      <Button
                        id="cta-register-btn"
                        size="lg"
                        className="h-12 px-8 bg-white text-purple-700 hover:bg-white/90 font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                      >
                        Crear cuenta gratis
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button
                        id="cta-login-btn"
                        variant="outline"
                        size="lg"
                        className="h-12 px-8 bg-transparent border-white/40 text-white hover:bg-white/10 font-medium"
                      >
                        Ya tengo cuenta
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/40 bg-background/50 py-8">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-semibold">
            <ShoppingBag className="h-4 w-4 text-primary" />
            <span className="gradient-text">Stock Master</span>
          </div>
          <nav className="flex items-center gap-6 text-xs">
            <a href="#features" className="hover:text-primary transition-colors">Características</a>
            <a href="#about" className="hover:text-primary transition-colors">Historia</a>
            <a href="#docs" className="hover:text-primary transition-colors">Documentación</a>
            <Link to="/login" className="hover:text-primary transition-colors">Acceder</Link>
          </nav>
          <p className="text-xs">© {new Date().getFullYear()} Stock Master. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
