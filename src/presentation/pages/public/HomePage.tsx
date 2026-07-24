import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { audioService } from '@/presentation/utils/audio.service'
import { Button } from '@/presentation/components/ui/button'
import {
  ArrowRight,
  BadgeCheck,
  Gauge,
  Gamepad2,
  Glasses,
  Headphones,
  Layers3,
  Laptop2,
  Package2,
  Search,
  ShieldCheck,
  TrendingUp,
  Truck,
  Users,
  Volume2,
  Zap,
  Star,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Globe2,
  Cpu,
  HelpCircle,
  ChevronDown,
  Building,
  Briefcase,
  Award,
  Calendar,
  Gift,
  Rocket,
  Target,
  FileText,
  Cloud,
  Database,
  UserCheck,
  ShoppingBag,
  CreditCard,
  PenTool,
  Compass,
} from 'lucide-react'

// URLs para imágenes de fondo y cards
const BACKGROUND_IMAGES = [
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1920&auto=format&fit=crop',
]

// Módulos principales (más detallados)
const MODULES = [
  {
    title: 'Catálogo por pestañas',
    description: 'Cada categoría abre una ruta dedicada para evitar contenido mezclado en una sola pantalla.',
    icon: Layers3,
    badge: 'Organización',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
  },
  {
    title: 'Sesión obligatoria',
    description: 'El carrito y el checkout sólo están disponibles cuando existe un token activo en el navegador.',
    icon: ShieldCheck,
    badge: 'Seguridad JWT',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=600&auto=format&fit=crop',
  },
  {
    title: 'Tipografía amplia',
    description: 'La interfaz prioriza contraste alto, tamaños grandes y bloques generosos para lectura cómoda.',
    icon: Gauge,
    badge: 'UI Accesible',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop',
  },
  {
    title: 'Despacho rápido',
    description: 'Se visualiza claramente la sucursal activa, impuestos y disponibilidad real por bodega.',
    icon: Truck,
    badge: 'Logística',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop',
  },
  {
    title: 'Reportes en tiempo real',
    description: 'Dashboard interactivo con métricas de ventas, rotación de inventario y márgenes.',
    icon: BarChart3,
    badge: 'Analítica',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
  },
  {
    title: 'Multi‑moneda y fiscalización',
    description: 'Soporte para múltiples divisas y cálculo automático de impuestos regionales.',
    icon: Globe2,
    badge: 'Cumplimiento',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&auto=format&fit=crop',
  },
]

// Rutas de categorías (con imágenes)
const ROUTES = [
  { label: 'Laptops', path: '/laptops', icon: Laptop2, image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1200&auto=format&fit=crop', count: '142 Modelos' },
  { label: 'Realidad Virtual', path: '/vr', icon: Glasses, image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?q=80&w=1200&auto=format&fit=crop', count: '38 Equipos' },
  { label: 'Audio & Sonido', path: '/audio', icon: Headphones, image: 'https://images.unsplash.com/photo-1518441902117-f0f5e5c0b9f7?q=80&w=1200&auto=format&fit=crop', count: '94 Dispositivos' },
  { label: 'Gaming', path: '/gaming', icon: Gamepad2, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop', count: '210 Accesorios' },
]

// Estadísticas
const STATS_CARDS = [
  { label: 'Transacciones mensuales', value: '$1.4M+', change: '+18.2%', icon: BarChart3 },
  { label: 'Empresas activas', value: '450+', change: '+25 este mes', icon: Users },
  { label: 'Tiempo de respuesta', value: '14ms', change: 'Ultra rápido', icon: Zap },
  { label: 'Precisión de stock', value: '99.99%', change: 'Sin mermas', icon: CheckCircle2 },
]

// Testimonios
const TESTIMONIALS = [
  {
    name: 'Carlos Mendoza',
    role: 'Director de Operaciones, TechStore Latam',
    comment: 'Implementar este ERP cambió por completo nuestra logística de inventario. La velocidad de sincronización en tiendas físicas es brutal.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Sofía Valenzuela',
    role: 'Gerente E-commerce, Nexus Gamer',
    comment: 'Las rutas dedicadas y el sistema de login seguro nos han evitado fraudes en carritos de alto valor. Sencillamente una obra maestra.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Ricardo Fernández',
    role: 'CEO, LogiTech Solutions',
    comment: 'La capacidad de manejar múltiples bodegas con visibilidad en tiempo real nos permitió reducir costos de almacenamiento en un 30%.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
]

// FAQ
const FAQS = [
  { q: '¿Cómo funciona la autenticación obligatoria?', a: 'El sistema valida un token JWT cifrado antes de permitir cualquier operación de checkout, protegiendo tanto al cliente como al inventario central.' },
  { q: '¿Puedo integrar múltiples bodegas físicas?', a: 'Sí, el software permite administrar stock descentralizado por sucursal con cálculos automáticos de impuestos locales.' },
  { q: '¿Se requiere instalación previa en PC?', a: 'No, es 100% nativo en la nube accesible desde cualquier navegador moderno con rendimiento optimizado.' },
  { q: '¿Qué tipo de soporte ofrecen?', a: 'Contamos con un equipo de ingenieros disponible 24/7 vía chat, correo y teléfono para resolver cualquier incidencia.' },
  { q: '¿Es posible personalizar el sistema?', a: 'Sí, ofrecemos módulos adicionales y personalización de flujos de trabajo según las necesidades de tu negocio.' },
]

// Marcas (logos)
const BRANDS = [
  { name: 'TechCorp', icon: Building },
  { name: 'InnovaSoft', icon: Briefcase },
  { name: 'GlobalTrade', icon: Globe2 },
  { name: 'SecureNet', icon: ShieldCheck },
  { name: 'DataFlow', icon: Database },
  { name: 'CloudSync', icon: Cloud },
  { name: 'Figma', icon: PenTool },
  { name: 'Chrome', icon: Compass },
]

// Pasos
const STEPS = [
  { icon: UserCheck, title: 'Regístrate', desc: 'Crea tu cuenta en menos de 2 minutos con tu correo empresarial.' },
  { icon: ShoppingBag, title: 'Configura tu catálogo', desc: 'Carga tus productos, precios y stock inicial de forma masiva.' },
  { icon: CreditCard, title: 'Conecta pasarelas de pago', desc: 'Vincula tu cuenta de Stripe, PayPal o Mercado Pago.' },
  { icon: Rocket, title: '¡Lanza tu tienda!', desc: 'Publica tu catálogo y empieza a recibir pedidos en segundos.' },
]

// Blog
const BLOG_POSTS = [
  {
    title: 'Cómo reducir el tiempo de preparación de pedidos en un 40%',
    excerpt: 'Descubre las técnicas de picking y organización de bodega que están revolucionando la logística en PyMEs.',
    date: '15 de junio, 2026',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    category: 'Logística',
  },
  {
    title: 'Nueva integración con Mercado Pago: pagos más ágiles',
    excerpt: 'Nuestro sistema ahora se conecta nativamente con Mercado Pago, reduciendo la fricción en el checkout.',
    date: '10 de junio, 2026',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop',
    category: 'Pagos',
  },
  {
    title: '5 errores comunes en la gestión de inventario y cómo evitarlos',
    excerpt: 'Aprende de los fallos más frecuentes que llevan a sobrestock o quiebres de stock y cómo solucionarlos.',
    date: '5 de junio, 2026',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f5f6?q=80&w=1200&auto=format&fit=crop',
    category: 'Consejos',
  },
]

// Planes
const PRICING_PLANS = [
  {
    name: 'Básico',
    price: '$29',
    period: '/mes',
    description: 'Ideal para emprendedores y pequeñas tiendas.',
    features: ['Hasta 500 productos', '1 bodega', 'Reportes básicos', 'Soporte por email'],
    buttonText: 'Comenzar gratis',
    popular: false,
  },
  {
    name: 'Profesional',
    price: '$79',
    period: '/mes',
    description: 'Perfecto para negocios en crecimiento.',
    features: ['Hasta 5,000 productos', 'Hasta 5 bodegas', 'Dashboard avanzado', 'Soporte 24/7', 'Integración con POS'],
    buttonText: 'Probar 14 días',
    popular: true,
  },
  {
    name: 'Empresarial',
    price: 'Personalizado',
    period: '',
    description: 'Soluciones a medida para grandes corporaciones.',
    features: ['Productos ilimitados', 'Bodegas ilimitadas', 'Analítica predictiva', 'Soporte dedicado', 'API completa'],
    buttonText: 'Contactar ventas',
    popular: false,
  },
]

// Componente Badge flotante
function FloatBadge({
  icon: Icon,
  label,
  value,
  valueClass = 'text-purple-400',
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="flex items-center gap-3 border border-white/10 bg-[#0A0510]/90 px-3.5 py-2.5 shadow-xl backdrop-blur-md rounded-xl transition-transform hover:scale-105 duration-300">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-purple-500/25 bg-purple-500/10">
        <Icon className="h-4 w-4 text-purple-400" />
      </div>
      <div>
        <p className="mb-0.5 text-[10px] leading-none text-purple-200/60 uppercase tracking-wider">{label}</p>
        <p className={`text-xs font-extrabold ${valueClass}`}>{value}</p>
      </div>
    </div>
  )
}

export default function HomePage() {
  const orb1 = useRef<HTMLDivElement>(null)
  const orb2 = useRef<HTMLDivElement>(null)
  const [currentBgIndex, setCurrentBgIndex] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [counters, setCounters] = useState({ users: 0, products: 0, orders: 0, satisfaction: 0 })
  const counterRef = useRef<HTMLDivElement>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const bgInterval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % BACKGROUND_IMAGES.length)
    }, 5000)

    const onScroll = () => {
      const y = window.scrollY
      if (orb1.current) orb1.current.style.transform = `translateY(${y * 0.12}px)`
      if (orb2.current) orb2.current.style.transform = `translateY(${y * -0.08}px)`
      setShowScrollTop(y > 600)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateCounter('users', 1250, 0)
          animateCounter('products', 28400, 0)
          animateCounter('orders', 3840, 0)
          animateCounter('satisfaction', 98, 0)
        }
      },
      { threshold: 0.5 }
    )
    if (counterRef.current) observer.observe(counterRef.current)

    return () => {
      clearInterval(bgInterval)
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  const animateCounter = (key: keyof typeof counters, target: number, current: number) => {
    if (current >= target) return
    const step = Math.ceil(target / 80)
    const next = Math.min(current + step, target)
    setCounters(prev => ({ ...prev, [key]: next }))
    requestAnimationFrame(() => animateCounter(key, target, next))
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div className="flex min-h-screen flex-col bg-[#090012] selection:bg-purple-500/30 selection:text-white overflow-x-hidden relative">

      {/* ========================================== */}
      {/* FONDO GLOBAL ANIMADO PARA TODA LA PÁGINA   */}
      {/* ========================================== */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-900/10 blur-[150px] animate-[pulse_8s_infinite]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-fuchsia-900/10 blur-[150px] animate-[pulse_10s_infinite_1s]" />
        <div className="absolute top-[40%] right-[20%] w-[40vw] h-[40vw] rounded-full bg-indigo-900/10 blur-[120px] animate-[pulse_9s_infinite_2s]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMzB2MzBtMzAtMzBIMHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNjgsIDg1LCAyNDcsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-50" />
      </div>      {/* ========================================== */}
      {/* HERO SECTION – Fondo lleno de vida         */}
      {/* ========================================== */}
      <section id="top" className="relative flex min-h-screen items-center overflow-hidden pt-16">
        {/* Carrusel de imágenes de fondo */}
        <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          {BACKGROUND_IMAGES.map((img, index) => (
            <div
              key={img}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                index === currentBgIndex ? 'opacity-50 scale-105' : 'opacity-0 scale-100'
              }`}
              style={{ backgroundImage: `url(${img})`, transition: 'opacity 1.5s ease-in-out, transform 8s ease-out' }}
            />
          ))}
        </div>

        {/* Overlays y efectos */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/60 via-[#090012]/90 to-[#090012]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" aria-hidden="true" />

        {/* Elementos decorativos (partículas / formas) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-fuchsia-600/15 rounded-full blur-3xl animate-pulse delay-2000" />
          {/* Grid sutil */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBkPSJNMjAgMjB2MjBtMjAtMjBIMHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNjgsIDg1LCAyNDcsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-50" />
        </div>

        <div ref={orb1} aria-hidden="true" className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-purple-600/20 blur-[120px]" />
        <div ref={orb2} aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-40 h-[440px] w-[440px] rounded-full bg-violet-500/20 blur-[120px]" />

        <div className="container mx-auto grid grid-cols-1 items-center gap-14 px-4 py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 max-w-[1800px] xl:px-12 relative z-10">
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-bold text-purple-200 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Next-Gen ERP &amp; Inventario Cloud · 2026
            </div>

            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white md:text-6xl xl:text-7xl">
              Control total y <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-purple-500 animate-pulse">gestión inteligente</span> de stock
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-purple-100/80 font-medium">
              Revoluciona la operación de tu PyME. Monitoreo en tiempo real, múltiples bodegas, seguridad avanzada y transacciones ultra rápidas desde cualquier dispositivo.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
              <div className="space-y-1 transform hover:translate-x-1 transition-transform">
                <p className="text-2xl font-black text-white">+99.9%</p>
                <p className="text-xs text-purple-300/70 font-medium">Disponibilidad en la nube</p>
              </div>
              <div className="space-y-1 transform hover:translate-x-1 transition-transform">
                <p className="text-2xl font-black text-purple-400">Tiempo Real</p>
                <p className="text-xs text-purple-300/70 font-medium">Sincronización POS</p>
              </div>
            </div>

            <div className="relative w-full max-w-lg group mt-2">
              <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-500 opacity-30 blur-lg transition duration-500 group-hover:opacity-60" />
              <div className="relative flex w-full items-center gap-3 rounded-3xl border border-white/15 bg-[#0A0510]/90 p-2 pl-5 backdrop-blur-xl transition-all focus-within:border-purple-500/50">
                <Search className="h-6 w-6 text-purple-400/80" />
                <input
                  type="text"
                  placeholder="Busca productos, SKU o marcas..."
                  className="flex-1 bg-transparent px-2 py-3 text-base font-medium text-white placeholder-purple-200/50 outline-none"
                />
                <Button className="h-12 rounded-2xl bg-purple-500 px-6 text-sm font-black text-white shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:bg-purple-400 transition-all hover:scale-105">
                  Explorar
                </Button>
              </div>
            </div>
          </div>

          <div className="relative lg:pl-10 animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
            <div aria-hidden="true" className="pointer-events-none absolute inset-10 rounded-full bg-purple-500/20 blur-[90px]" />

            <div className="absolute -left-8 top-12 z-20 animate-[bounce_4s_infinite]">
              <FloatBadge icon={TrendingUp} label="Ventas hoy" value="+12.4%" valueClass="text-purple-400" />
            </div>
            <div className="absolute -right-4 bottom-32 z-20 animate-[bounce_5s_infinite_1s]">
              <FloatBadge icon={Package2} label="Stock crítico" value="3 alertas" valueClass="text-rose-400" />
            </div>
            <div className="absolute left-1/2 -top-6 z-20 -translate-x-1/2 animate-[bounce_4.5s_infinite_0.5s]">
              <FloatBadge icon={Zap} label="Sincronización POS" value="Activa" />
            </div>

            <div className="group relative z-10 overflow-hidden rounded-3xl border border-white/15 bg-[#0A0510]/95 shadow-2xl backdrop-blur-2xl transition-transform hover:scale-[1.01] duration-500">
              <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                <span className="h-3 w-3 rounded-full bg-purple-500/80 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                <div className="mx-4 flex flex-1 items-center justify-center gap-2 rounded-full bg-black/50 px-4 py-1.5 text-center font-mono text-[11px] text-purple-200/70 border border-white/5">
                  <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                  nexus-market.local/dashboard-secure
                </div>
                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-[10px] font-bold text-purple-300 border border-purple-500/30">
                  Secure v2.6
                </span>
              </div>
              <div className="relative aspect-[16/10] overflow-hidden bg-[#0A0510]">
                <div className="absolute inset-0 flex flex-col p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-7 w-40 rounded-lg bg-white/10 animate-pulse"></div>
                    <div className="flex gap-2">
                      <div className="h-7 w-7 rounded-full bg-white/10"></div>
                      <div className="h-7 w-24 rounded-lg bg-purple-500/20 border border-purple-500/30"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-20 rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col justify-between">
                      <div className="h-2 w-8 bg-purple-400/40 rounded"></div>
                      <div className="h-4 w-12 bg-white/20 rounded"></div>
                    </div>
                    <div className="h-20 rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col justify-between">
                      <div className="h-2 w-8 bg-purple-400/40 rounded"></div>
                      <div className="h-4 w-12 bg-white/20 rounded"></div>
                    </div>
                    <div className="h-20 rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col justify-between">
                      <div className="h-2 w-8 bg-purple-400/40 rounded"></div>
                      <div className="h-4 w-12 bg-white/20 rounded"></div>
                    </div>
                  </div>
                  <div className="flex-1 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden flex items-end p-4">
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent"></div>
                    <div className="w-full flex items-end justify-between gap-2 h-16">
                      <div className="w-1/6 bg-purple-500/40 rounded-t h-[40%] transition-all duration-1000 hover:h-[60%]"></div>
                      <div className="w-1/6 bg-purple-500/60 rounded-t h-[70%] transition-all duration-1000 hover:h-[85%]"></div>
                      <div className="w-1/6 bg-purple-500/60 rounded-t h-[55%] transition-all duration-1000 hover:h-[75%]"></div>
                      <div className="w-1/6 bg-purple-500 rounded-t h-[90%] shadow-[0_0_12px_rgba(168,85,247,0.5)]"></div>
                      <div className="w-1/6 bg-purple-400/60 rounded-t h-[65%] transition-all duration-1000 hover:h-[80%]"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#090012] via-transparent to-transparent opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* ESTADÍSTICAS EN TIEMPO REAL                */}
      {/* ========================================== */}
      <section className="mx-auto max-w-[1800px] xl:px-12 px-4 py-12 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS_CARDS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-purple-500/20 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-purple-500/40 hover:shadow-[0_10px_30px_rgba(168,85,247,0.15)] group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <stat.icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl font-black text-white mb-1 tracking-tight">{stat.value}</p>
              <p className="text-sm font-medium text-purple-200/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* CONTADORES ANIMADOS                        */}
      {/* ========================================== */}
      <section ref={counterRef} className="mx-auto max-w-[1800px] xl:px-12 px-4 py-16 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 rounded-[2.5rem] border border-purple-500/20 bg-gradient-to-b from-white/[0.05] to-transparent p-8 backdrop-blur-xl">
          <div className="text-center">
            <p className="text-4xl sm:text-5xl font-black text-white">{counters.users.toLocaleString()}+</p>
            <p className="text-sm text-purple-200/60 mt-1">Usuarios activos</p>
          </div>
          <div className="text-center">
            <p className="text-4xl sm:text-5xl font-black text-purple-400">{counters.products.toLocaleString()}+</p>
            <p className="text-sm text-purple-200/60 mt-1">Productos gestionados</p>
          </div>
          <div className="text-center">
            <p className="text-4xl sm:text-5xl font-black text-white">{counters.orders.toLocaleString()}+</p>
            <p className="text-sm text-purple-200/60 mt-1">Pedidos procesados</p>
          </div>
          <div className="text-center">
            <p className="text-4xl sm:text-5xl font-black text-purple-400">{counters.satisfaction}%</p>
            <p className="text-sm text-purple-200/60 mt-1">Satisfacción cliente</p>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* MÓDULOS CON IMÁGENES (cards visuales)      */}
      {/* ========================================== */}
      <section className="mx-auto max-w-[1800px] xl:px-12 px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-purple-200">
              <Gauge className="h-3.5 w-3.5 text-purple-400" /> Arquitectura del Sistema
            </span>
            <h2 className="text-4xl font-black text-white sm:text-5xl tracking-tight">
              Bloques amplios, legibles y sin saturación visual
            </h2>
          </div>
          <p className="max-w-2xl text-base font-medium leading-relaxed text-purple-200/65 sm:text-lg">
            Diseñado bajo los más altos estándares de UI/UX para garantizar velocidad operativa, cero fricciones en la gestión y control absoluto de los flujos comerciales.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {MODULES.map((module) => (
            <article
              key={module.title}
              className="group relative rounded-[2rem] border border-purple-500/20 bg-white/[0.04] overflow-hidden backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-purple-400/50 hover:shadow-[0_20px_40px_rgba(168,85,247,0.2)]"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={module.image} alt={module.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090012] via-transparent to-transparent" />
              </div>
              <div className="p-6 relative -mt-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:scale-110 transition-transform duration-300">
                    <module.icon className="h-7 w-7" />
                  </div>
                  <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
                    {module.badge}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white mb-3 group-hover:text-purple-300 transition-colors">{module.title}</h3>
                <p className="text-base leading-relaxed text-purple-200/70">{module.description}</p>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-bold text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Ver documentación técnica</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* PROCESO EN 4 PASOS                         */}
      {/* ========================================== */}
      <section className="mx-auto max-w-[1800px] xl:px-12 px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-white/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.28em] text-purple-200">
            <Target className="h-3.5 w-3.5 text-purple-400" /> Empieza en minutos
          </span>
          <h2 className="text-4xl font-black text-white sm:text-5xl tracking-tight">Tu tienda lista en 4 pasos</h2>
          <p className="text-purple-200/65 text-base sm:text-lg">Sin complicaciones, sin código, sin esperas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, idx) => (
            <div key={idx} className="relative group rounded-[2rem] border border-purple-500/20 bg-white/[0.04] p-8 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-purple-500/40">
              <div className="absolute -top-3 -right-3 bg-purple-500 text-[10px] font-black text-white px-3 py-1 rounded-full">Paso {idx+1}</div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] mb-6 group-hover:scale-110 transition-transform">
                <step.icon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">{step.title}</h3>
              <p className="text-purple-200/70 text-base leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* BANNER INTERACTIVO (automatización)        */}
      {/* ========================================== */}
      <section className="mx-auto max-w-[1800px] xl:px-12 px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-purple-500/30 bg-gradient-to-r from-purple-900/30 via-[#120520] to-fuchsia-950/30 p-8 sm:p-12 lg:p-16 backdrop-blur-2xl">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-purple-500/15 blur-[100px] pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-fuchsia-500/15 blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-bold text-purple-300">
                <Sparkles className="h-3.5 w-3.5" /> Automatización Comercial Total
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Optimiza cada transacción desde el primer clic
              </h2>
              <p className="text-purple-100/75 text-base sm:text-lg leading-relaxed">
                Nuestra plataforma conecta inventarios locales con pasarelas de pago cifradas, reduciendo tiempos de espera y evitando discrepancias de stock en tiempo real.
              </p>
              <div className="space-y-3 pt-2">
                {['Auditorías de stock automatizadas al instante', 'Reportes de ganancias exportables en formato dinámico', 'Soporte multi-divisa y cálculo de impuestos regionales'].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-purple-400" />
                    </div>
                    <span className="text-sm font-semibold text-white">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md flex flex-col justify-between hover:border-purple-500/40 transition-all group">
                <Globe2 className="h-8 w-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Cloud Multi-Región</h4>
                  <p className="text-xs text-purple-200/60 leading-relaxed">Infredundancia global para evitar caídas de servicio durante picos de venta masiva.</p>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md flex flex-col justify-between hover:border-purple-500/40 transition-all group sm:translate-y-6">
                <Cpu className="h-8 w-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Motor Predictivo</h4>
                  <p className="text-xs text-purple-200/60 leading-relaxed">Algoritmos inteligentes que sugieren reabastecimiento antes de agotar existencias.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* ACCESOS DIRECTOS POR CATEGORÍA             */}
      {/* ========================================== */}
      <section className="mx-auto max-w-[1800px] xl:px-12 px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-white/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.28em] text-purple-200 mb-3">
              Catálogo Dinámico
            </span>
            <h2 className="text-4xl font-black text-white sm:text-5xl tracking-tight">Accesos directos por categoría</h2>
            <p className="mt-2 text-lg text-purple-200/65">Cada botón abre una vista independiente sin mezclar contenido.</p>
          </div>
          <Link to="/features" onClick={() => audioService.playClick()}>
            <Button className="h-12 rounded-2xl border border-purple-400/30 bg-white/5 px-6 text-sm font-bold text-white hover:bg-white/10 transition-all hover:scale-105">
              Ver garantías completas
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {ROUTES.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              onClick={() => audioService.playClick()}
              className="group overflow-hidden rounded-[2rem] border border-purple-500/20 bg-white/[0.04] p-4 transition-all duration-300 hover:-translate-y-2 hover:border-purple-400/60 hover:bg-white/[0.08] hover:shadow-[0_20px_40px_rgba(168,85,247,0.25)]"
            >
              <div className="relative overflow-hidden rounded-[1.5rem] border border-purple-500/20">
                <img src={route.image} alt={route.label} className="h-60 w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090012] via-[#090012]/40 to-transparent" />

                <div className="absolute left-4 top-4 flex items-center justify-between right-4">
                  <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.15em] text-white backdrop-blur-md">
                    <route.icon className="h-3.5 w-3.5 text-purple-400" /> {route.label}
                  </div>
                  <span className="rounded-full bg-purple-500/20 border border-purple-500/40 px-2.5 py-1 text-[10px] font-bold text-purple-300 backdrop-blur-md">
                    {route.count}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-2xl font-black text-white group-hover:text-purple-300 transition-colors">{route.label}</p>
                    <p className="text-sm font-medium text-purple-100/75">Abrir ruta dedicada</p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-[0_0_18px_rgba(168,85,247,0.25)] group-hover:bg-purple-500 group-hover:border-purple-400 group-hover:text-white transition-all duration-300">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* MARCAS QUE CONFÍAN                         */}
      {/* ========================================== */}
      <section className="mx-auto max-w-[1800px] xl:px-12 px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-white/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.28em] text-purple-200">
            <Award className="h-3.5 w-3.5 text-purple-400" /> Marcas que confían
          </span>
          <h2 className="text-4xl font-black text-white sm:text-5xl tracking-tight">Empresas líderes ya usan Nexus</h2>
          <p className="text-purple-200/65 text-base sm:text-lg">Más de 450 organizaciones han optimizado su operación con nosotros.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-6">
          {BRANDS.map((brand) => (
            <div key={brand.name} className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all hover:border-purple-500/40 hover:bg-white/[0.08] group">
              <brand.icon className="h-12 w-12 text-purple-300 group-hover:text-purple-400 transition-colors" />
              <span className="mt-3 text-xs font-bold text-purple-200/60 group-hover:text-white transition-colors">{brand.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* TESTIMONIOS                                */}
      {/* ========================================== */}
      <section className="mx-auto max-w-[1800px] xl:px-12 px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-white/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.28em] text-purple-200">
            Confianza Comprobada
          </span>
          <h2 className="text-4xl font-black text-white sm:text-5xl tracking-tight">Lo que dicen nuestros líderes</h2>
          <p className="text-purple-200/65 text-base sm:text-lg">Empresas de tecnología y retail confían en nuestra infraestructura a diario.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="rounded-[2.5rem] border border-purple-500/20 bg-white/[0.04] p-8 sm:p-10 backdrop-blur-xl relative flex flex-col justify-between group hover:border-purple-400/40 transition-all">
              <div className="absolute top-8 right-8 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-purple-400 text-purple-400" />
                ))}
              </div>
              <p className="text-purple-100/85 text-lg sm:text-xl font-medium leading-relaxed mb-8 italic">
                "{t.comment}"
              </p>
              <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                <img src={t.avatar} alt={t.name} className="h-14 w-14 rounded-full object-cover border-2 border-purple-500/40" />
                <div>
                  <h4 className="text-lg font-black text-white">{t.name}</h4>
                  <p className="text-xs text-purple-300/70 font-medium">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* PLANES Y PRECIOS                           */}
      {/* ========================================== */}
      <section className="mx-auto max-w-[1800px] xl:px-12 px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-white/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.28em] text-purple-200">
            <Gift className="h-3.5 w-3.5 text-purple-400" /> Elige tu plan
          </span>
          <h2 className="text-4xl font-black text-white sm:text-5xl tracking-tight">Precios transparentes</h2>
          <p className="text-purple-200/65 text-base sm:text-lg">Sin sorpresas, cancela cuando quieras.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRICING_PLANS.map((plan) => (
            <div key={plan.name} className={`relative rounded-[2.5rem] border p-8 backdrop-blur-xl transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(168,85,247,0.15)] ${plan.popular ? 'border-purple-500/60 bg-gradient-to-b from-purple-500/10 to-transparent' : 'border-purple-500/20 bg-white/[0.04]'}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-[10px] font-black text-white px-4 py-1 rounded-full uppercase tracking-wider">
                  Más popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-2xl font-black text-white">{plan.name}</h3>
                <p className="text-purple-200/60 text-sm mt-1">{plan.description}</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                {plan.period && <span className="text-purple-200/50 text-sm ml-1">{plan.period}</span>}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-purple-200/80">
                    <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className={`w-full rounded-2xl font-bold ${plan.popular ? 'bg-purple-500 hover:bg-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]' : 'border border-purple-400/30 bg-white/5 text-white hover:bg-white/10'}`}>
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* BLOG                                      */}
      {/* ========================================== */}
      <section className="mx-auto max-w-[1800px] xl:px-12 px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-white/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.28em] text-purple-200">
              <FileText className="h-3.5 w-3.5 text-purple-400" /> Últimas novedades
            </span>
            <h2 className="text-4xl font-black text-white sm:text-5xl tracking-tight mt-2">Blog y actualizaciones</h2>
          </div>
          <Link to="/blog" className="text-purple-400 font-bold flex items-center gap-2 hover:gap-3 transition-all">
            Ver todos los artículos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <div key={post.title} className="group rounded-[2rem] border border-purple-500/20 bg-white/[0.04] overflow-hidden backdrop-blur-xl transition-all hover:-translate-y-2 hover:border-purple-500/40">
              <div className="relative overflow-hidden h-56">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-4 left-4 bg-purple-500/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                  {post.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-purple-300/60 mb-2">
                  <Calendar className="h-3.5 w-3.5" />
                  {post.date}
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-purple-300 transition-colors mb-2">{post.title}</h3>
                <p className="text-purple-200/60 text-sm leading-relaxed">{post.excerpt}</p>
                <div className="mt-4 flex items-center gap-2 text-purple-400 font-bold text-sm group-hover:gap-3 transition-all">
                  Leer más <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* FAQ                                       */}
      {/* ========================================== */}
      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-white/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.28em] text-purple-200">
            <HelpCircle className="h-3.5 w-3.5 text-purple-400" /> Dudas Comunes
          </span>
          <h2 className="text-4xl font-black text-white tracking-tight">Preguntas Frecuentes</h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index
            return (
              <div
                key={index}
                className="rounded-2xl border border-purple-500/20 bg-white/[0.04] backdrop-blur-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left font-bold text-white text-lg hover:text-purple-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-purple-300 transition-transform duration-300 ${isOpen ? 'rotate-180 text-purple-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-purple-200/70 text-base leading-relaxed animate-in fade-in duration-300">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ========================================== */}
      {/* SEGURIDAD Y LOGIN OBLIGATORIO              */}
      {/* ========================================== */}
      <section className="mx-auto max-w-[1800px] xl:px-12 px-4 pb-20 pt-8 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-6 rounded-[2.5rem] border border-purple-500/20 bg-gradient-to-r from-purple-950/60 via-[#10001a] to-indigo-950/50 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-12 shadow-2xl backdrop-blur-2xl">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/25 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-purple-200">
              <BadgeCheck className="h-3.5 w-3.5 text-purple-400" /> Compra protegida
            </span>
            <h2 className="text-4xl font-black text-white sm:text-5xl tracking-tight">Login obligatorio para carrito y pago</h2>
            <p className="max-w-2xl text-lg leading-relaxed text-purple-100/70">
              La capa de negocio ya bloquea acciones de carrito sin token activo. Si no hay sesión, la acción se corta y la interfaz redirige a login con seguridad de nivel bancario.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Users, title: 'Perfil autenticado' },
              { icon: Package2, title: 'Inventario sincronizado' },
              { icon: Volume2, title: 'Experiencia inmersiva' },
              { icon: ShieldCheck, title: 'Pago seguro' },
            ].map((item) => (
              <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10 hover:border-purple-500/40 hover:-translate-y-1">
                <item.icon className="h-7 w-7 text-purple-400 mb-4" />
                <p className="text-lg font-black text-white">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* CTA FINAL                                  */}
      {/* ========================================== */}
      <section className="mx-auto max-w-[1800px] xl:px-12 px-4 pb-28 sm:px-6 lg:px-8 relative z-10">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-purple-900/40 via-[#120520] to-fuchsia-900/40 p-10 sm:p-16 text-center border border-purple-500/30 backdrop-blur-2xl">
          <div className="absolute -top-20 -right-20 h-80 w-80 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 bg-fuchsia-500/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">¿Listo para transformar tu negocio?</h2>
            <p className="text-purple-200/70 text-base sm:text-lg mb-8">Únete a miles de empresas que ya optimizan su inventario con Nexus. Comienza hoy sin compromiso.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="rounded-2xl bg-purple-500 px-8 py-6 text-base font-black text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:bg-purple-400 transition-all hover:scale-105">
                Comenzar prueba gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button className="rounded-2xl border border-purple-400/30 bg-white/5 px-8 py-6 text-base font-bold text-white hover:bg-white/10 transition-all">
                <HelpCircle className="mr-2 h-5 w-5" />
                Hablar con ventas
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* BOTÓN VOLVER ARRIBA                        */}
      {/* ========================================== */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 rounded-full bg-purple-500 p-3 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:bg-purple-400 transition-all hover:scale-110"
        >
          <ArrowRight className="h-6 w-6 rotate-[-90deg]" />
        </button>
      )}

    </div>
  )
}