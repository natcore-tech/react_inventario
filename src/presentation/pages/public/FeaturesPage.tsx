// src/presentation/pages/public/FeaturesPage.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Package, Shield, Barcode, ShoppingCart, FileText, Users,
  ArrowRight, CheckCircle2, RefreshCw, CreditCard, MapPin,
  Boxes, Sparkles, Layers, Zap, Lock, Clock,
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'

export default function FeaturesPage() {
  const [activeCategory, setActiveCategory] = useState('all')

  const FEATURE_CATEGORIES = [
    { id: 'all', label: 'Todas las Funciones' },
    { id: 'stock', label: 'Almacén & Bodegas' },
    { id: 'pos', label: 'Punto de Venta POS' },
    { id: 'security', label: 'Seguridad & Roles' },
  ]

  const DETAILED_FEATURES = [
    {
      cat: 'stock',
      icon: Boxes,
      badge: 'Multi-Bodega & Ubicaciones',
      title: 'Control Total de Existencias & Transferencias Físicas',
      desc: 'Monitorea el inventario distribuido en múltiples almacenes o tiendas físicas. Realiza traslados entre bodegas con trazabilidad del envío y confirmación obligatoria de recepción para evitar mermas o pérdidas en tránsito. Asigna ubicaciones por pasillo, estante y casilla para agilizar la preparación de pedidos.',
      image: '/images/hero_dashboard_preview.png',
      bullets: [
        'Traspasos entre sucursales con estado En Tránsito y Confirmado',
        'Definición de stock mínimo y punto de reorden por cada depósito',
        'Zonificación física (Pasillo, Estante, Nivel, Columna)',
        'Valorización en tiempo real por depósito según costo promedio',
        'Reportes de rotación de inventario y productos de baja salida',
      ],
      accent: 'text-primary',
      border: 'border-primary/40',
    },
    {
      cat: 'pos',
      icon: ShoppingCart,
      badge: 'Terminal POS 2.0',
      desc: 'Terminal de cobro ultrarrápida diseñada para procesar ventas en menos de 10 segundos. Compatible con escáneres de código de barras USB o Bluetooth, cobro con múltiples métodos de pago combinados y control ciego de turnos de caja con arqueo de efectivo.',
      image: '/images/features_analytics_mockup.png',
      bullets: [
        'Búsqueda por código de barras, SKU o coincidencia fonética',
        'Apertura, arqueo intermedio y cierre de caja con cuadre ciego',
        'Facturación electrónica e impresión instantánea de tickets',
        'Descuentos por producto o por total con contraseña de autorización',
        'Modo contingencia con guardado diferido en el navegador',
      ],
      accent: 'text-emerald-400',
      border: 'border-emerald-400/40',
    },
    {
      cat: 'stock',
      icon: Barcode,
      badge: 'Trazabilidad Unitaria',
      desc: 'Controla productos de alto valor o con garantía mediante seguimiento unitario por número de serie único. Registra el historial inmutable de cada ítem desde su recepción con la orden de compra hasta la entrega final al cliente.',
      image: '/images/login_auth_illustration.png',
      bullets: [
        'Rastreo individual de número de serie inmutable',
        'Historial de movimientos e historial de usuario operador',
        'Ajustes de inventario auditados con motivo obligatorio',
        'Devoluciones de clientes con verificación de garantía',
        'Exportación de Kardex valorizado en Excel y PDF',
      ],
      accent: 'text-cyan-400',
      border: 'border-cyan-400/40',
    },
    {
      cat: 'security',
      icon: Shield,
      badge: 'Seguridad Django REST',
      desc: 'Protección de datos de nivel bancario respaldada por Django REST Framework. El sistema evalúa el campo is_staff en la base de datos para segmentar automáticamente la interfaz: los administradores acceden al panel completo de compras y usuarios, mientras los vendedores son derivados a la consola POS.',
      image: '/images/hero_dashboard_preview.png',
      bullets: [
        'Autenticación JWT con mecanismo de refresco transparente',
        'Evaluación del campo is_staff para restringir vistas sensibles',
        'Gestión de usuarios y permisos en tiempo real desde la consola de admin',
        'Bitácora inmutable de auditoría por cada acción realizada',
        'Conexión cifrada SSL/TLS de extremo a extremo',
      ],
      accent: 'text-purple-400',
      border: 'border-purple-400/40',
    },
  ]

  const filteredFeatures = activeCategory === 'all'
    ? DETAILED_FEATURES
    : DETAILED_FEATURES.filter(f => f.cat === activeCategory)

  return (
    <div className="space-y-12 py-8 container mx-auto px-4 lg:px-8">

      {/* ── HERO BANNER CARD ── */}
      <section className="glass-card p-8 lg:p-14 relative overflow-hidden border-primary/40 bg-card/80 backdrop-blur-2xl rounded-3xl shadow-2xl">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 dot-pattern opacity-15 pointer-events-none" />

        <div className="relative z-10 text-center space-y-6 max-w-4xl mx-auto">
          <span className="section-badge border-primary/40 bg-primary/10">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Catálogo Completo de Capacidades Enterprise & Pyme
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-foreground">
            Todas las herramientas para <br />
            <span className="gradient-text text-glow">escalar tu negocio al 100%</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Explora la arquitectura completa de Stock Master ERP: desde el control físico de bodegas hasta la emisión de tickets en el punto de venta (POS) y la seguridad por roles de Django REST Framework.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/register">
              <Button size="lg" className="btn-glow h-13 px-8 text-base font-extrabold rounded-2xl">
                Probar plataforma gratis <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/docs">
              <Button variant="outline" size="lg" className="h-13 px-8 text-base rounded-2xl border-border/70 hover:border-primary/50 hover:bg-primary/10">
                Ver Documentación API
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── PANORAMIC 3D SHOWCASE BANNER WITH LOCAL IMAGE ── */}
      <section className="glass-card p-4 sm:p-6 relative overflow-hidden border-primary/35 bg-card/80 backdrop-blur-2xl rounded-3xl shadow-2xl">
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-border/40">
          <img
            src="/images/features_analytics_mockup.png"
            alt="Módulo de Analítica y POS Stock Master 3D"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-background/80 backdrop-blur-xl rounded-2xl border border-primary/30 mt-4 shadow-xl">
          <div className="space-y-1">
            <span className="text-[11px] font-black text-primary tracking-wider uppercase">Visualización Unificada</span>
            <h3 className="text-lg sm:text-xl font-black text-foreground">Consola de Control Comercial & Logística</h3>
            <p className="text-xs text-muted-foreground">Sincronización en tiempo real entre inventario físico y ventas de caja.</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-xl border border-emerald-500/20">
              <CheckCircle2 className="h-4 w-4" /> DRF JWT Sync
            </span>
            <span className="flex items-center gap-1.5 text-primary bg-primary/10 px-3.5 py-1.5 rounded-xl border border-primary/20">
              <Layers className="h-4 w-4" /> Multi-Bodega
            </span>
          </div>
        </div>
      </section>

      {/* ── CATEGORY FILTER BUTTONS ── */}
      <section className="flex items-center justify-center gap-3 flex-wrap">
        {FEATURE_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-300 border ${
              activeCategory === cat.id
                ? 'border-primary/60 bg-primary/20 text-primary shadow-lg shadow-primary/10'
                : 'border-border/50 bg-card/40 text-muted-foreground hover:bg-card hover:text-foreground'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </section>

      {/* ── MAIN DETAILED FEATURE CARDS (VISIBLE CONTAINERS) ── */}
      <section className="space-y-8">
        {filteredFeatures.map(({ icon: Icon, badge, title, desc, image, bullets, accent, border }) => (
          <div
            key={title}
            className={`glass-card p-8 lg:p-12 relative overflow-hidden border ${border} bg-card/70 backdrop-blur-2xl rounded-3xl shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group`}
          >
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center ${accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-extrabold text-muted-foreground bg-muted/40 px-3 py-1 rounded-full border border-border/40 uppercase tracking-wider">
                  {badge}
                </span>
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-black text-foreground group-hover:text-primary transition-colors">
                  {title}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                {bullets.map(b => (
                  <div key={b} className="flex items-start gap-2.5 text-xs font-semibold text-foreground/90">
                    <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${accent}`} />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side Image Canvas */}
            <div className="lg:col-span-5 relative aspect-[16/11] rounded-2xl overflow-hidden border border-border/40 shadow-2xl">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
          </div>
        ))}
      </section>

      {/* ── SECONDARY MODULES GRID (VISIBLE GLASS CARDS) ── */}
      <section className="glass-card p-8 lg:p-12 border-primary/30 bg-card/60 backdrop-blur-2xl rounded-3xl space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="section-badge">Módulos Secundarios</span>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Estructura Funcional 360°</h2>
          <p className="text-xs text-muted-foreground">Cada rincón de tu empresa cubierto por herramientas especializadas.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Package, title: 'Catálogo de Productos', desc: 'Gestión de SKUs, precios diferenciados, impuestos, imágenes y estado activo/inactivo con búsqueda ultrarrápida.' },
            { icon: FileText, title: 'Órdenes de Compra', desc: 'Requerimientos a proveedores con cálculo automático de totales, estado de recepción y carga directa al inventario.' },
            { icon: Users, title: 'Gestión de Clientes', desc: 'Fichas de clientes con identificación, email, teléfono, límite de crédito e historial de comprobantes de venta.' },
            { icon: RefreshCw, title: 'Devoluciones Auditadas', desc: 'Gestión transparente de productos devueltos por cliente con motivo registrado e integración al stock físico.' },
            { icon: CreditCard, title: 'Métodos de Pago', desc: 'Configura cobros en efectivo, transferencias bancarias, tarjetas de débito/crédito y pasarelas de pago.' },
            { icon: MapPin, title: 'Ubicaciones Físicas', desc: 'Organiza las bodegas por pasillo, estante, sección y casilla para optimizar los tiempos de picking.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-2xl bg-background/70 border border-border/40 space-y-3 hover:border-primary/45 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-primary/12 border border-primary/25 flex items-center justify-center text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-extrabold text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TECHNICAL SPECS & PERFORMANCE BAND ── */}
      <section className="glass-card p-8 lg:p-12 border-primary/30 bg-card/60 backdrop-blur-2xl rounded-3xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="section-badge">Especificaciones Técnicas</span>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">Rendimiento de Grado Comercial</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Latencia Promedio API', value: '< 45 ms', icon: Clock },
            { label: 'Encriptación de Tokens', value: 'JWT SHA-256', icon: Lock },
            { label: 'Exportación de Datos', value: 'PDF / Excel / CSV', icon: FileText },
            { label: 'Disponibilidad Servidor', value: '99.9% Uptime', icon: Zap },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="p-4 rounded-2xl bg-background/70 border border-border/40 space-y-2">
              <Icon className="h-5 w-5 text-primary mx-auto" />
              <p className="text-lg font-black text-foreground">{value}</p>
              <p className="text-[11px] text-muted-foreground font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BOTTOM ── */}
      <section className="rounded-3xl border border-primary/35 bg-card/80 backdrop-blur-2xl p-8 sm:p-14 text-center space-y-6 shadow-2xl">
        <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
          ¿Listo para transformar la logística de tu empresa?
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Únete a comercios que gestionan sus sucursales y productos con rapidez, precisión y control total de roles.
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
