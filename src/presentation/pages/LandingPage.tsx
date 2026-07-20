import { Link } from 'react-router-dom'
import { Button } from '@/presentation/components/ui/button'
import { ShoppingBag, ArrowRight, BarChart3, Package, Users, Zap, Shield, Globe, CheckCircle2, Building2, Store, Truck } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50 overflow-hidden font-sans">
      {/* Estilos para animaciones personalizadas */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 4s ease-in-out infinite 2s;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>

      {/* Navbar con glassmorphism */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2 text-white shadow-lg shadow-indigo-500/30 transition-transform hover:scale-105">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Stock Master
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 mr-6">
            <Link to="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Características</Link>
            <Link to="#solutions" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Soluciones</Link>
            <Link to="#testimonials" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Testimonios</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all rounded-full px-6">
                Entrar
              </Button>
            </Link>
            <Link to="/register">
              <Button className="font-medium bg-white text-slate-900 hover:bg-slate-200 hover:scale-105 transition-all shadow-xl shadow-white/10 rounded-full px-6 hidden sm:flex">
                Empezar gratis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 relative">
        {/* Efectos de luces de fondo globales */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

        {/* Hero Section */}
        <section className="w-full pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32 relative z-10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-10 text-center">
              
              <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300 animate-fade-in-up">
                <Zap className="mr-2 h-4 w-4 text-indigo-400" />
                <span className="flex gap-2 items-center">
                  La nueva versión v2.0 ya está aquí
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                </span>
              </div>

              <div className="space-y-6 max-w-4xl">
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl animate-fade-in-up delay-100">
                  Controla tu inventario con{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                    precisión absoluta
                  </span>
                </h1>
                <p className="mx-auto max-w-[750px] text-slate-400 md:text-xl leading-relaxed animate-fade-in-up delay-200">
                  La plataforma definitiva para gestionar tus productos, ventas y compras. Todo en un solo lugar, con una interfaz diseñada para ser rápida, evitar errores y hacer crecer tu negocio sin fricciones.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-5 animate-fade-in-up delay-300">
                <Link to="/login">
                  <Button size="lg" className="h-14 px-8 text-base bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.7)] transition-all hover:-translate-y-1">
                    Comenzar ahora
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all hover:-translate-y-1 backdrop-blur-sm bg-slate-900/50">
                  <Globe className="mr-2 h-5 w-5" />
                  Ver demostración
                </Button>
              </div>

              {/* Social Proof */}
              <div className="pt-12 animate-fade-in-up delay-300 flex flex-col items-center">
                <p className="text-sm font-medium text-slate-500 mb-6 uppercase tracking-widest">Confiado por más de 10,000 negocios</p>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                  <div className="flex items-center gap-2"><Store className="h-6 w-6"/> <span className="font-bold text-xl">RetailCorp</span></div>
                  <div className="flex items-center gap-2"><Building2 className="h-6 w-6"/> <span className="font-bold text-xl">TechStore</span></div>
                  <div className="flex items-center gap-2"><Truck className="h-6 w-6"/> <span className="font-bold text-xl">LogisPro</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24 relative z-10 border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-3xl">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-20 animate-fade-in-up">
              <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Todo lo que necesitas para escalar</h2>
              <p className="mt-6 text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">Nuestras herramientas están diseñadas para automatizar lo aburrido para que puedas enfocarte en lo que realmente importa: incrementar tus ventas.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 p-8 transition-all hover:border-indigo-500/50 hover:bg-slate-800/80 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
                <div className="relative z-10 flex flex-col items-start space-y-4">
                  <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-400 ring-1 ring-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-colors animate-float">
                    <Package className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-100">Gestión de Stock Multibodega</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Mantén el control exacto de tus existencias en múltiples ubicaciones físicas. Transfiere inventario fácilmente y recibe alertas automáticas antes de quedarte sin stock.
                  </p>
                  <ul className="text-sm text-slate-400 space-y-2 mt-4 w-full">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-400"/> Trazabilidad completa</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-400"/> Alertas por email y SMS</li>
                  </ul>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 p-8 transition-all hover:border-purple-500/50 hover:bg-slate-800/80 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
                <div className="relative z-10 flex flex-col items-start space-y-4">
                  <div className="rounded-2xl bg-purple-500/10 p-3 text-purple-400 ring-1 ring-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition-colors animate-float-delayed">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-100">Analítica Avanzada y Reportes</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Visualiza tus ventas, movimientos de caja y proyecciones con gráficos modernos. Exporta información detallada a PDF o Excel con un solo clic.
                  </p>
                  <ul className="text-sm text-slate-400 space-y-2 mt-4 w-full">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-purple-400"/> Reportes en tiempo real</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-purple-400"/> Exportación a Excel/PDF</li>
                  </ul>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 p-8 transition-all hover:border-pink-500/50 hover:bg-slate-800/80 hover:shadow-2xl hover:shadow-pink-500/10 hover:-translate-y-2">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-pink-500/10 blur-2xl group-hover:bg-pink-500/20 transition-all"></div>
                <div className="relative z-10 flex flex-col items-start space-y-4">
                  <div className="rounded-2xl bg-pink-500/10 p-3 text-pink-400 ring-1 ring-pink-500/20 group-hover:bg-pink-500 group-hover:text-white transition-colors animate-float">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-100">Punto de Venta Rápido (POS)</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Un POS diseñado para la velocidad. Búsqueda por código de barras, soporte para escáner, múltiples métodos de pago y cierres de caja transparentes.
                  </p>
                  <ul className="text-sm text-slate-400 space-y-2 mt-4 w-full">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-pink-400"/> Compatible con lectores USB</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-pink-400"/> Facturación electrónica</li>
                  </ul>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 p-8 transition-all hover:border-emerald-500/50 hover:bg-slate-800/80 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                <div className="relative z-10 flex flex-col items-start space-y-4">
                  <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400 ring-1 ring-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-colors animate-float-delayed">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-100">Roles y Seguridad</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    No todos deben ver todo. Controla qué pueden ver y hacer tus empleados con un sistema robusto de permisos, cajeros y administradores.
                  </p>
                </div>
              </div>

              {/* Promo Card que ocupa 2 columnas */}
              <div className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 p-8 md:col-span-2 flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:border-indigo-500/50">
                <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-indigo-500/10 to-transparent"></div>
                <div className="relative z-10 space-y-4 md:max-w-md">
                  <div className="inline-flex items-center rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300">
                    Novedad
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">Facturación 100% en la Nube</h3>
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                    Sincroniza todas tus sucursales en tiempo real. Si vendes un producto en la Sucursal A, el stock de la base central se actualiza al instante. 
                  </p>
                </div>
                <div className="relative z-10 shrink-0">
                  <Link to="/register">
                    <Button className="rounded-full bg-white text-indigo-950 hover:bg-slate-200 px-8 py-6 text-base font-semibold shadow-xl">
                      Probar Gratis 14 Días
                    </Button>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CTA Section Final */}
        <section className="w-full py-24 relative z-10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="relative overflow-hidden rounded-[3rem] bg-indigo-600 px-6 py-20 sm:px-12 sm:py-24 text-center shadow-2xl">
              <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-black/10 blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 mx-auto max-w-2xl space-y-8">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                  ¿Listo para modernizar tu negocio?
                </h2>
                <p className="text-indigo-100 text-lg md:text-xl leading-relaxed">
                  Únete a miles de empresas que ya han optimizado sus inventarios, reducido pérdidas y aumentado sus ganancias con Stock Master.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                  <Link to="/register">
                    <Button size="lg" className="h-14 px-10 text-base font-bold bg-white text-indigo-600 hover:bg-slate-100 hover:scale-105 transition-all rounded-full shadow-xl">
                      Crear mi cuenta gratis
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-indigo-200 mt-4">
                  No se requiere tarjeta de crédito. Configuración en 2 minutos.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer minimalista y moderno */}
      <footer className="w-full border-t border-slate-800/80 py-12 bg-slate-950 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-indigo-500" />
                <span className="text-xl font-bold text-slate-200">Stock Master</span>
              </div>
              <p className="text-slate-400 max-w-sm">
                Software de gestión de inventarios y punto de venta diseñado para empresas modernas que buscan crecer rápido y sin complicaciones.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-100">Producto</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="#" className="hover:text-indigo-400 transition-colors">Características</Link></li>
                <li><Link to="#" className="hover:text-indigo-400 transition-colors">Punto de Venta</Link></li>
                <li><Link to="#" className="hover:text-indigo-400 transition-colors">Precios</Link></li>
                <li><Link to="#" className="hover:text-indigo-400 transition-colors">Actualizaciones</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-slate-100">Soporte</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="#" className="hover:text-indigo-400 transition-colors">Centro de Ayuda</Link></li>
                <li><Link to="#" className="hover:text-indigo-400 transition-colors">Guías en Video</Link></li>
                <li><Link to="#" className="hover:text-indigo-400 transition-colors">Contacto</Link></li>
                <li><Link to="#" className="hover:text-indigo-400 transition-colors">Estado del Sistema</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-800/80 pt-8">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Stock Master Inc. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <Link to="#" className="text-sm text-slate-500 hover:text-white transition-colors">Términos de Servicio</Link>
              <Link to="#" className="text-sm text-slate-500 hover:text-white transition-colors">Política de Privacidad</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
