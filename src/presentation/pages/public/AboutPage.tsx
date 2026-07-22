// src/presentation/pages/public/AboutPage.tsx
import { Link } from 'react-router-dom'
import {
  ArrowRight, Sparkles, Shield, Heart, Zap, Award, CheckCircle2,
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'

const TIMELINE = [
  {
    year: '2022',
    title: 'El Caos de las Bodegas Manuales',
    desc: 'Un grupo de ingenieros y comerciantes locales sufrió pérdidas acumuladas por más de $40,000 debido al descontrol de existencias en cuadernos manuscritos y planillas Excel sin sincronizar. Nace la decisión inquebrantable de construir una solución definitiva.',
    accent: 'border-amber-400/50 text-amber-400 bg-amber-400/10',
  },
  {
    year: '2023',
    title: 'Nacimiento de la Arquitectura REST',
    desc: 'Desarrollo del núcleo backend en Django REST Framework con tokens JWT, enrutamiento estricto por campo is_staff y una API REST capaz de procesar miles de transacciones concurrentes por segundo.',
    accent: 'border-primary/50 text-primary bg-primary/10',
  },
  {
    year: '2024',
    title: 'Lanzamiento Multi-Bodega & POS 2.0',
    desc: 'Incorporación de transferencias entre sucursales con trazabilidad de despacho, seguimiento por número de serie único y caja registradora ultrarrápida con cobro en menos de 10 segundos.',
    accent: 'border-emerald-400/50 text-emerald-400 bg-emerald-400/10',
  },
  {
    year: '2026',
    title: 'Plataforma Líder para Pymes',
    desc: 'Stock Master respalda hoy la operación diaria de cientos de comercios en Latinoamérica, ofreciendo un entorno visual estilo Bento Grid con switch de tema dual persistente.',
    accent: 'border-purple-400/50 text-purple-400 bg-purple-400/10',
  },
]

const FOUNDERS = [
  {
    name: 'Carlos Mendoza',
    role: 'CEO & Co-Fundador',
    bio: 'Ex-director de logística comercial con más de 12 años optimizando bodegas y cadenas de suministro en Latinoamérica.',
    initials: 'CM',
    badge: 'Logística ERP',
  },
  {
    name: 'Sofia Benítez',
    role: 'CTO & Co-Fundadora',
    bio: 'Especialista en arquitecturas Django REST y sistemas distribuidos en la nube con alta disponibilidad.',
    initials: 'SB',
    badge: 'Backend DRF',
  },
  {
    name: 'Javier Roca',
    role: 'VP de Producto UI/UX',
    bio: 'Diseñador galardonado apasionado por crear interfaces glassmorphism de alta densidad y micro-interacciones fluidas.',
    initials: 'JR',
    badge: 'Diseño React',
  },
]

export default function AboutPage() {
  return (
    <div className="space-y-12 py-8 container mx-auto px-4 lg:px-8">

      {/* ── HERO BANNER CARD ── */}
      <section className="glass-card p-8 lg:p-14 relative overflow-hidden border-primary/40 bg-card/80 backdrop-blur-2xl rounded-3xl shadow-2xl">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 dot-pattern opacity-15 pointer-events-none" />

        <div className="relative z-10 text-center space-y-6 max-w-4xl mx-auto">
          <span className="section-badge border-primary/40 bg-primary/10">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Nuestra Origen & Misión Épica
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-foreground">
            De bodegas caóticas a <br />
            <span className="gradient-text text-glow">tecnología de control empresarial</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            No inventamos un problema abstracto. Vivimos en carne propia la frustración de perder dinero y clientes por falta de visibilidad en el inventario. Por eso creamos Stock Master.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/register">
              <Button size="lg" className="btn-glow h-13 px-8 text-base font-extrabold rounded-2xl">
                Unirse a la comunidad <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="outline" size="lg" className="h-13 px-8 text-base rounded-2xl border-border/70 hover:border-primary/50 hover:bg-primary/10">
                Ver Funcionalidades
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── EPIC BACKSTORY SECTION (VISIBLE GLASS CONTAINER) ── */}
      <section className="glass-card p-8 lg:p-14 relative overflow-hidden border-primary/35 bg-card/70 backdrop-blur-2xl rounded-3xl shadow-2xl space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3.5 py-1 rounded-full border border-primary/25">
              La Historia Detrás de Stock Master
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight leading-snug">
              "Cansados del descontrol en hojas de cálculo, diseñamos la solución que nosotros mismos necesitábamos"
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <p>
                En el año 2022, nuestros fundadores administraban una cadena de distribución comercial. Las ventas crecían, pero los márgenes desaparecían. Los cuadernos de notas se extraviaban, las planillas de Excel fallaban por errores humanos y los robos hormiga en bodegas sin auditar sumaban miles de dólares en pérdidas trimestrales.
              </p>
              <p>
                Evaluamos las alternativas del mercado: los ERPs tradicionales costaban decenas de miles de dólares y requerían meses de capacitación, mientras que las apps simples carecían de trazabilidad por número de serie o soporte multi-bodega.
              </p>
              <p>
                Fue entonces cuando nació <strong className="text-foreground">Stock Master ERP</strong>: una plataforma nativa web construida con <strong className="text-primary">Django REST Framework</strong> para una seguridad inexpugnable e interfaz <strong className="text-primary">React moderna</strong> para cobros ultrarrápidos en el punto de venta.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/30">
              <div className="p-3.5 rounded-2xl bg-background/60 border border-border/40 text-center">
                <p className="text-2xl font-black text-primary">+1,400</p>
                <p className="text-[10px] text-muted-foreground font-bold">Bodegas Conectadas</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-background/60 border border-border/40 text-center">
                <p className="text-2xl font-black text-emerald-400">99.9%</p>
                <p className="text-[10px] text-muted-foreground font-bold">Trazabilidad Exacta</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-background/60 border border-border/40 text-center">
                <p className="text-2xl font-black text-purple-400">100%</p>
                <p className="text-[10px] text-muted-foreground font-bold">Seguridad JWT DRF</p>
              </div>
            </div>
          </div>

          {/* Right Side Illustration Frame */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card p-6 border-primary/30 space-y-4 bg-background/80 backdrop-blur-xl rounded-2xl">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-foreground">El Compromiso Stock Master</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Garantizar que ningún comerciante vuelva a sufrir pérdidas por falta de visibilidad en sus sucursales.
              </p>
              <div className="space-y-2 pt-2">
                {[
                  'Sincronización instantánea de stock',
                  'Soporte para lector de código de barras',
                  'Control estricto de roles is_staff de Django',
                  'Exportación de informes a Excel y PDF',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE SECTION (VISIBLE CARDS) ── */}
      <section className="glass-card p-8 lg:p-12 relative overflow-hidden border-primary/30 bg-card/60 backdrop-blur-2xl rounded-3xl space-y-8">
        <div className="text-center space-y-3">
          <span className="section-badge">Hitos Relevantes</span>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Nuestra Evolución (2022 - 2026)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TIMELINE.map(({ year, title, desc, accent }) => (
            <div key={year} className={`p-6 rounded-2xl bg-background/70 border ${accent.split(' ')[0]} space-y-3 hover:border-primary/50 transition-all duration-300`}>
              <span className={`inline-block px-3 py-1 rounded-xl text-xs font-black border ${accent}`}>
                {year}
              </span>
              <h3 className="text-base font-extrabold text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOUNDERS / TEAM SECTION ── */}
      <section className="glass-card p-8 lg:p-12 relative overflow-hidden border-primary/30 bg-card/60 backdrop-blur-2xl rounded-3xl space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="section-badge">Equipo Fundador</span>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Las Mentes Detrás de la Plataforma</h2>
          <p className="text-xs text-muted-foreground">Combinamos experiencia comercial real con ingeniería de software avanzada.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FOUNDERS.map(({ name, role, bio, initials, badge }) => (
            <div key={name} className="p-6 rounded-2xl bg-background/70 border border-border/40 text-center space-y-4 hover:border-primary/45 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-primary font-black text-xl mx-auto shadow-lg">
                {initials}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-foreground">{name}</h3>
                <p className="text-[11px] text-primary font-bold">{role}</p>
                <span className="inline-block text-[9px] font-bold text-muted-foreground bg-muted/40 border border-border/40 px-2.5 py-0.5 rounded-full uppercase">
                  {badge}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="glass-card p-8 lg:p-12 relative overflow-hidden border-primary/30 bg-card/60 backdrop-blur-2xl rounded-3xl space-y-8">
        <div className="text-center space-y-3">
          <span className="section-badge">Nuestros Pilares</span>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Principios Inquebrantables</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: 'Velocidad Extrema', desc: 'Cada acción en el POS o inventario toma menos de 3 clics para no perder ventas.' },
            { icon: Shield, title: 'Seguridad Sin Concesiones', desc: 'Autenticación con tokens JWT y control estricto de roles is_staff de Django REST.' },
            { icon: Heart, title: 'Diseño Centrado en el Usuario', desc: 'Interfaces modernas estilo Bento Grid con switch de tema dual persistente.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-2xl bg-background/70 border border-border/40 text-center space-y-3 hover:border-primary/45 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary mx-auto">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BOTTOM ── */}
      <section className="rounded-3xl border border-primary/35 bg-card/80 backdrop-blur-2xl p-8 sm:p-14 text-center space-y-6 shadow-2xl">
        <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
          ¿Listo para formar parte del cambio?
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Únete a cientos de comercios que ya automatizaron sus sucursales con Stock Master ERP.
        </p>
        <Link to="/register">
          <Button size="lg" className="btn-glow font-extrabold px-10 h-13 rounded-2xl text-base">
            Crear Cuenta de Prueba Gratis <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>

    </div>
  )
}
