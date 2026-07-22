// src/presentation/pages/public/FeaturesPage.tsx
import { Link } from 'react-router-dom'
import {
  Package, Shield, Barcode, ShoppingCart, FileText, Users,
  ArrowRight, CheckCircle2, RefreshCw, CreditCard, MapPin,
  Boxes, Sparkles, Layers,
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { useReveal } from '@/presentation/hooks/useReveal'

export default function FeaturesPage() {
  const gridRef = useReveal(0.05)
  const detailRef = useReveal(0.06)

  const MAIN_FEATURES = [
    {
      icon: Boxes,
      category: 'Inventario & Stock',
      title: 'Control Multi-Bodega & Ubicaciones Físicas',
      desc: 'Supervisa tus existencias en tiempo real distribuidas en múltiples almacenes o sucursales físicas. Define stock mínimo por producto y recibe alertas automáticas antes de quedar desabastecido.',
      items: [
        'Transferencias inmediatas entre bodegas',
        'Ubicaciones por pasillo, estante y sección',
        'Alertas tempranas de reabastecimiento',
        'Soporte para marcas, categorías y unidades de medida',
        'Ajustes de inventario auditados con motivo',
      ],
      accent: 'text-primary',
    },
    {
      icon: ShoppingCart,
      category: 'Facturación & POS',
      title: 'Punto de Venta Ultrarrápido & Turnos de Caja',
      desc: 'Atiende clientes y efectúa cobros en menos de 10 segundos. Compatible con escáner de código de barras, control de apertura/cierre de turnos de caja y emisión de tickets.',
      items: [
        'Escaneo instantáneo de código de barras',
        'Turnos de caja con cuadre estricto de efectivo',
        'Múltiples métodos de pago integrados',
        'Historial e impresión de tickets de venta',
        'Descuentos y promociones automatizadas',
      ],
      accent: 'text-emerald-400',
    },
    {
      icon: Barcode,
      category: 'Trazabilidad Avanzada',
      title: 'Números de Serie & Auditoría de Movimientos',
      desc: 'Controla productos de alto valor mediante seguimiento unitario por número de serie único. Realiza ajustes de inventario con motivo registrado para auditorías impecables.',
      items: [
        'Rastreo unitario por número de serie único',
        'Motivos de ajuste de inventario configurables',
        'Historial inmutable de entradas y salidas',
        'Registro transparente de devoluciones de cliente',
        'Seguimiento por usuario operador',
      ],
      accent: 'text-cyan-400',
    },
    {
      icon: Shield,
      category: 'Seguridad & Roles',
      title: 'Control de Permisos de Staff Django REST',
      desc: 'Garantiza la seguridad operativa mediante autenticación JWT y delimitación estricta de permisos según la propiedad is_staff en la base de datos de Django.',
      items: [
        'Autenticación robusta JWT (Access/Refresh Tokens)',
        'Gestión dinámica de usuarios is_staff por Administrador',
        'Restricción de vistas sensibles para usuarios normales',
        'Protección contra manipulaciones de endpoints',
        'Sesiones con refresco automático de credenciales',
      ],
      accent: 'text-purple-400',
    },
  ]

  return (
    <div className="space-y-20 py-12">

      {/* ── HERO HEADER ── */}
      <section className="relative overflow-hidden pt-8 pb-12">
        <div className="container mx-auto px-4 lg:px-8 text-center space-y-6 max-w-3xl">
          <span className="section-badge border-primary/40 bg-primary/10">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Capacidades Enterprise & Pyme
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-foreground">
            Todas las herramientas para <span className="gradient-text">escalar tu negocio</span>
          </h1>

          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Explora las funcionalidades avanzadas de Stock Master ERP: desde la gestión de almacenes físicos hasta el punto de venta de alta velocidad con respaldo Django REST.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/register">
              <Button className="btn-glow h-12 px-8 font-extrabold text-sm rounded-2xl">
                Probar Gratis Ahora <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/docs">
              <Button variant="outline" className="h-12 px-8 text-sm rounded-2xl border-border/70 hover:border-primary/50 hover:bg-primary/10">
                Ver Guías de API
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── MASSIVE FEATURE SHOWCASE BANNER IMAGE ── */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-primary/35 shadow-2xl bg-card/70 backdrop-blur-2xl p-3 sm:p-5 group">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/25 via-transparent to-purple-600/20 pointer-events-none" />

          {/* Large Showcase Image */}
          <img
            src="/images/features_analytics_mockup.png"
            alt="Módulo de Analítica y POS Stock Master 3D"
            className="w-full h-auto rounded-2xl object-cover max-h-[500px] shadow-2xl transition-transform duration-700 group-hover:scale-[1.01]"
          />

          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4 bg-background/85 backdrop-blur-2xl p-5 rounded-2xl border border-primary/30 shadow-2xl">
            <div className="space-y-1">
              <span className="text-[11px] font-black text-primary tracking-wider uppercase">Visualización Integral</span>
              <h3 className="text-base sm:text-lg font-black text-foreground">Consola Única de Control Operativo</h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Sincronización en vivo
              </span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:flex items-center gap-1.5 text-primary">
                <Layers className="h-4 w-4" /> Multi-Bodega Activo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN FEATURES GRID ── */}
      <section className="container mx-auto px-4 lg:px-8">
        <div ref={gridRef} className="reveal grid grid-cols-1 md:grid-cols-2 gap-8">
          {MAIN_FEATURES.map(({ icon: Icon, category, title, desc, items, accent }, i) => (
            <div key={title} className={`glass-card p-8 space-y-6 relative overflow-hidden group reveal delay-${i + 1} hover:border-primary/45 transition-all duration-300`}>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className={`h-6 w-6 ${accent}`} />
                </div>
                <span className="text-[10px] font-extrabold text-muted-foreground bg-muted/40 px-3 py-1 rounded-full border border-border/40 uppercase tracking-wider">
                  {category}
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-foreground group-hover:text-primary transition-colors duration-250">
                  {title}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-border/30">
                {items.map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-xs font-semibold text-foreground/90">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DETAILED CAPABILITIES CARDS ── */}
      <section className="container mx-auto px-4 lg:px-8 border-t border-border/40 pt-16">
        <div className="text-center mb-12 space-y-3">
          <span className="section-badge">Catálogos & Módulos</span>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Gestión 360° para tu Negocio</h2>
        </div>

        <div ref={detailRef} className="reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Package, title: 'Catálogo de Productos', desc: 'Gestión de SKU, precios, impuesto, imágenes y estado activo/inactivo.' },
            { icon: FileText, title: 'Órdenes de Compra', desc: 'Generación de requerimientos a proveedores con cálculo automático de totales.' },
            { icon: Users, title: 'Gestión de Clientes', desc: 'Fichas de clientes con identificación, email, teléfono e historial de ventas.' },
            { icon: RefreshCw, title: 'Devoluciones', desc: 'Gestión transparente de productos devueltos con reintegración inmediata.' },
            { icon: CreditCard, title: 'Métodos de Pago', desc: 'Configura efectivo, transferencia, tarjetas y canales digitales de cobro.' },
            { icon: MapPin, title: 'Ubicaciones Físicas', desc: 'Organiza tus bodegas por pasillo, estante y sección de almacenamiento.' },
          ].map(({ icon: Icon, title, desc }, idx) => (
            <div key={title} className={`glass-card p-6 space-y-3 group hover:border-primary/45 transition-all duration-300 reveal delay-${idx + 1}`}>
              <div className="w-10 h-10 rounded-xl bg-primary/12 border border-primary/25 flex items-center justify-center group-hover:bg-primary/22 transition-colors">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-base font-bold text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BOTTOM ── */}
      <section className="container mx-auto px-4 lg:px-8 pb-8">
        <div className="rounded-3xl border border-primary/35 bg-card/60 backdrop-blur-2xl p-8 sm:p-14 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
            ¿Listo para transformar tu inventario?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Únete a empresas que gestionan sus sucursales y productos con rapidez, precisión y control total de roles.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register">
              <Button size="lg" className="btn-glow font-extrabold px-10 h-13 rounded-2xl text-base">
                Crear Cuenta de Prueba Gratis <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="h-13 px-8 rounded-2xl border-border/70 hover:border-primary/50 hover:bg-primary/10 text-base">
                Conocer nuestra historia
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
