// src/presentation/pages/public/AboutPage.tsx
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Shield, Heart, Zap } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { useReveal } from '@/presentation/hooks/useReveal'

const TIMELINE = [
  {
    year: '2022',
    title: 'El Desafío Inicial',
    desc: 'Descuadres de inventario y planillas manuales afectaban a pequeños comercios locales. Nace la idea de simplificar el control de existencias con tecnología moderna.',
    accent: 'border-amber-400/50 text-amber-400 bg-amber-400/10',
  },
  {
    year: '2023',
    title: 'Primer Prototipo REST + Web',
    desc: 'Un equipo de ingenieros diseña la primera versión con arquitectura limpia, endpoints Django REST y punto de venta POS ultrarrápido.',
    accent: 'border-primary/50 text-primary bg-primary/10',
  },
  {
    year: '2024',
    title: 'Lanzamiento Multi-Bodega & Series',
    desc: 'Se agregan funcionalidades enterprise: control de múltiples sucursales, rastreo unitario por número de serie y auditoría de ajustes.',
    accent: 'border-emerald-400/50 text-emerald-400 bg-emerald-400/10',
  },
  {
    year: '2026',
    title: 'Plataforma Líder para Pymes',
    desc: 'Stock Master procesa miles de movimientos diarios con respaldo seguro por roles (is_staff), switch de tema dual e interfaz premium.',
    accent: 'border-purple-400/50 text-purple-400 bg-purple-400/10',
  },
]

export default function AboutPage() {
  const timelineRef = useReveal(0.04)
  const valuesRef   = useReveal(0.06)

  return (
    <div className="space-y-20 py-12">

      {/* ── HERO HEADER ── */}
      <section className="relative overflow-hidden pt-8 pb-12">
        <div className="container mx-auto px-4 lg:px-8 text-center space-y-6 max-w-3xl">
          <span className="section-badge border-primary/40 bg-primary/10">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Nuestra Historia & Misión
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-foreground">
            Construido para transformar la <span className="gradient-text">gestión comercial</span>
          </h1>

          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Stock Master nació para eliminar la complejidad de las planillas en Excel y ofrecer a cada negocio el control total de sus almacenes y ventas en tiempo real.
          </p>

          <div className="flex justify-center pt-2">
            <Link to="/register">
              <Button className="btn-glow h-12 px-8 font-extrabold text-sm rounded-2xl">
                Unirse Hoy Gratis <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <span className="section-badge">Trayectoria</span>
          <h2 className="text-3xl font-black text-foreground tracking-tight">De Prototipo a Plataforma ERP</h2>
        </div>

        <div ref={timelineRef} className="reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TIMELINE.map(({ year, title, desc, accent }, i) => (
            <div key={year} className={`glass-card p-6 space-y-4 group hover:border-primary/45 transition-all duration-300 reveal delay-${i + 1}`}>
              <span className={`inline-block px-3 py-1 rounded-xl text-xs font-black border ${accent}`}>
                {year}
              </span>
              <h3 className="text-lg font-extrabold text-foreground group-hover:text-primary transition-colors">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="container mx-auto px-4 lg:px-8 border-t border-border/40 pt-16">
        <div className="text-center mb-12 space-y-3">
          <span className="section-badge">Valores</span>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Nuestros Principios</h2>
        </div>

        <div ref={valuesRef} className="reveal grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: 'Velocidad Extrema', desc: 'Cada acción en el POS o inventario toma menos de 3 clics.' },
            { icon: Shield, title: 'Seguridad Sin Concesiones', desc: 'Autenticación con tokens JWT y control estricto de roles.' },
            { icon: Heart, title: 'Diseño Centrado en el Usuario', desc: 'Interfaces modernas, claras y con switch de tema dual.' },
          ].map(({ icon: Icon, title, desc }, idx) => (
            <div key={title} className={`glass-card p-6 space-y-3 text-center group hover:border-primary/45 transition-all duration-300 reveal delay-${idx + 1}`}>
              <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary mx-auto group-hover:scale-110 transition-transform">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
